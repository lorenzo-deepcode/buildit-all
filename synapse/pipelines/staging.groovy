@Library('buildit')
def LOADED = true

node {
  withEnv(["PATH+NODE=${tool name: 'carbon', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {

    currentBuild.result = "SUCCESS"
    sendNotifications = !env.DEV_MODE

    try {
      stage("Set Up") {
        // clean the workspace before checking out
        if(fileExists('.git')) {
          echo 'Perform workspace cleanup'
          sh "git clean -ffdx"
        }

        sh "curl -L https://dl.bintray.com/buildit/maven/jenkins-pipeline-libraries-${env.PIPELINE_LIBS_VERSION}.zip -o lib.zip && echo 'A' | unzip lib.zip"

        if (env.USE_GLOBAL_LIB) {
          ecrInst = new ecr()
          gitInst = new git()
          npmInst = new npm()
          slackInst = new slack()
          convoxInst = new convox()
          templateInst = new template()
        } else {
          sh "curl -L https://dl.bintray.com/buildit/maven/jenkins-pipeline-libraries-${env.PIPELINE_LIBS_VERSION}.zip -o lib.zip && echo 'A' | unzip lib.zip"
          ecrInst = load "lib/ecr.groovy"
          gitInst = load "lib/git.groovy"
          npmInst = load "lib/npm.groovy"
          slackInst = load "lib/slack.groovy"
          convoxInst = load "lib/convox.groovy"
          templateInst = load "lib/template.groovy"
        }

        domainName = "${env.MONGO_HOSTNAME}".substring(8)
        registryBase = "006393696278.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
        registry = "https://${registryBase}"
        appName = "synapse"

        // global for exception handling
        slackChannel = "synapse"
        gitUrl = "https://github.com/buildit/synapse"
        appUrl = "http://synapse.staging.${domainName}"
      }

      stage("Checkout") {

        checkout scm

        // global for exception handling
        shortCommitHash = gitInst.getShortCommit()
        commitMessage = gitInst.getCommitMessage()
        version = npmInst.getVersion()
      }

      stage("Install") {
        sh "node --version"
        sh "npm install"
      }

      stage("Test") {
        try {
          sh "npm run test:ci"
        }
        finally {
          junit 'reports/test-results.xml'
          publishHTML(target: [reportDir: 'reports', reportFiles: 'test-results.html', reportName: 'Test Results'])
        }
      }

      stage("Analysis") {
        sh "npm run lint"
      }

      stage("Build") {
        sh "NODE_ENV='staging' EOLAS_DOMAIN='${domainName}' npm run build"
      }

      stage("Docker Image Build") {
        tag = "${version}-${shortCommitHash}-${env.BUILD_NUMBER}"
        image = docker.build("${appName}:${tag}", '.')
        ecrInst.authenticate(env.AWS_REGION)
      }

      stage("Docker Push") {
        docker.withRegistry(registry) {
          image.push("${tag}")
        }
      }

      stage("Deploy To Staging") {
        tmpFile = UUID.randomUUID().toString() + ".tmp"
        ymlData = templateInst.transform(readFile("docker-compose.yml.template"), [tag: tag, registry_base: registryBase])
        writeFile(file: tmpFile, text: ymlData)

        convoxInst.login("${env.CONVOX_RACKNAME}")
        convoxInst.ensureApplicationCreated("${appName}-staging")
        sh "convox env set NODE_ENV=staging EOLAS_DOMAIN=${domainName} --app ${appName}-staging"
        sh "convox deploy --app ${appName}-staging --description '${tag}' --file ${tmpFile} --wait"
      }

      stage("Run Functional Tests") {
        // wait until the app is deployed
        convoxInst.waitUntilDeployed("${appName}-staging")
        convoxInst.ensureSecurityGroupSet("${appName}-staging", env.CONVOX_SECURITYGROUP)

        // run Selenium tests
        try {
          sh "NODE_ENV=staging URL=http://synapse.staging.${domainName} xvfb-run -d -s '-screen 0 1280x1024x16' npm run test:acceptance:ci"
        }
        finally {
          archiveArtifacts allowEmptyArchive: true, artifacts: 'screenshots/*.png'
          junit 'reports/acceptance-test-results.xml'
        }
      }

      stage("Promote Build to latest") {
        docker.withRegistry(registry) {
          image.push("latest")
        }

        if(sendNotifications) slackInst.notify("Deployed to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> has been deployed to <${appUrl}|${appUrl}>\n\n${commitMessage}", "good", "http://images.8tracks.com/cover/i/001/225/360/18893.original-9419.jpg?rect=50,0,300,300&q=98&fm=jpg&fit=max&w=100&h=100", slackChannel)
      }
    }
    catch (err) {
      currentBuild.result = "FAILURE"

      if(sendNotifications) slackInst.notify("Error while deploying to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> failed to deploy to <${appUrl}|${appUrl}>", "danger", "https://yt3.ggpht.com/-X2hgGcBURV8/AAAAAAAAAAI/AAAAAAAAAAA/QnCcurrZr50/s100-c-k-no-mo-rj-c0xffffff/photo.jpg", slackChannel)
      throw err
    }
  }
}
