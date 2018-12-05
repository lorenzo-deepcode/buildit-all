// Production release pipeline
@Library('buildit')
def LOADED = true

node {

  currentBuild.result = "SUCCESS"
  sendNotifications = !env.DEV_MODE

  try {

    stage("Set Up") {
      checkout scm

      if(env.USE_GLOBAL_LIB) {
        uiInst = new ui()
        ecrInst = new ecr()
        slackInst = new slack()
        templateInst = new template()
        convoxInst = new convox()
      } else {
        sh "curl -L https://dl.bintray.com/buildit/maven/jenkins-pipeline-libraries-${env.PIPELINE_LIBS_VERSION}.zip -o lib.zip && echo 'A' | unzip lib.zip"
        uiInst = load "lib/ui.groovy"
        ecrInst = load "lib/ecr.groovy"
        slackInst = load "lib/slack.groovy"
        templateInst = load "lib/template.groovy"
        convoxInst = load "lib/convox.groovy"
      }

      domainName = "${env.MONGO_HOSTNAME}".substring(8)
      appName = "synapse"
      registryBase = "006393696278.dkr.ecr.${env.AWS_REGION}.amazonaws.com"

      // global for exception handling
      slackChannel = "synapse"
      gitUrl = "https://github.com/buildit/synapse"
      appUrl = "http://synapse.${domainName}"
    }

    stage("Write docker-compose") {
      // global for exception handling
      // tag = uiInst.selectTag(ecrInst.imageTags(appName, env.AWS_REGION))
      tag = "latest"
      tmpFile = UUID.randomUUID().toString() + ".tmp"
      ymlData = templateInst.transform(readFile("docker-compose.yml.template"), [tag: tag, registry_base: registryBase])

      writeFile(file: tmpFile, text: ymlData)
    }

    stage("Deploy to production") {
      convoxInst.login("${env.CONVOX_RACKNAME}")
      convoxInst.ensureApplicationCreated("${appName}")
      sh "convox env set NODE_ENV=production EOLAS_DOMAIN=${domainName} --app ${appName}"
      sh "convox deploy --app ${appName} --description '${tag}' --file ${tmpFile} --wait"
      sh "rm ${tmpFile}"

      // wait until the app is deployed
      convoxInst.waitUntilDeployed("${appName}")
      convoxInst.ensureSecurityGroupSet("${appName}", env.CONVOX_SECURITYGROUP)
      if(sendNotifications) slackInst.notify("Deployed to Production", "Tag <${gitUrl}/commits/tag/${tag}|${tag}> has been deployed to <${appUrl}|${appUrl}>", "good", "http://images.8tracks.com/cover/i/001/225/360/18893.original-9419.jpg?rect=50,0,300,300&q=98&fm=jpg&fit=max&w=100&h=100", slackChannel)
    }
  }
  catch (err) {
    currentBuild.result = "FAILURE"
    if(sendNotifications) slackInst.notify("Error while deploying to Production", "Tag <${gitUrl}/commits/tag/${tag}|${tag}> failed to deploy to <${appUrl}|${appUrl}>", "danger", "https://yt3.ggpht.com/-X2hgGcBURV8/AAAAAAAAAAI/AAAAAAAAAAA/QnCcurrZr50/s100-c-k-no-mo-rj-c0xffffff/photo.jpg", slackChannel)
    throw err
  }
}
