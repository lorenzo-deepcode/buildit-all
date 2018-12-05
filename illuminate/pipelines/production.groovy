// Production release pipeline
@Library('buildit')
def LOADED = true

node {

  currentBuild.result = "SUCCESS"
  sendNotifications = !env.DEV_MODE

  try {

    stage ('Set Up') {
      checkout scm

      slackInst = new slack()
      templateInst = new template()
      convoxInst = new convox()

      appName = "illuminate"
      domainName = "${env.MONGO_HOSTNAME}".substring(8)
      serverUrl = "${appName}.${domainName}"
      serverPort = "80"
      context = "production"

      mongoUrl = "mongodb://${env.MONGO_HOSTNAME}:27017"
      registryBase = "006393696278.dkr.ecr.${env.AWS_REGION}.amazonaws.com"

      // global for exception handling
      slackChannel = "synapse"
      gitUrl = "https://github.com/buildit/${appName}"
      appUrl = "http://${appName}.${domainName}"
    }

    stage ('Write docker-compose') {
      // global for exception handling
      tag = "latest"
      tmpFile = UUID.randomUUID().toString() + ".tmp"
      ymlData = templateInst.transform(readFile("docker-compose.yml.template"), [tag: tag, registry_base: registryBase, mongo_url: mongoUrl, server_url: serverUrl, server_port: serverPort])

      writeFile(file: tmpFile, text: ymlData)
    }

    stage ('Deploy to production') {
      convoxInst.login("${env.CONVOX_RACKNAME}")
      convoxInst.ensureApplicationCreated("${appName}")
      sh "convox env set NODE_ENV=production --app ${appName}"
      sh "convox deploy --app ${appName} --description '${tag}' --file ${tmpFile} --wait"
      sh "rm ${tmpFile}"

      // wait until the app is deployed
      convoxInst.waitUntilDeployed("${appName}")
      convoxInst.ensureSecurityGroupSet("${appName}", env.CONVOX_SECURITYGROUP)
      slackInst.notify("Deployed to Production", "Tag <${gitUrl}/commits/tag/${tag}|${tag}> has been deployed to <${appUrl}|${appUrl}>", "good", "http://i3.kym-cdn.com/entries/icons/original/000/006/536/illuminati-conspiracy.jpg", slackChannel)
    }
  }
  catch (err) {
    currentBuild.result = "FAILURE"
    slackInst.notify("Error while deploying to Production", "Tag <${gitUrl}/commits/tag/${tag}|${tag}> failed to deploy to <${appUrl}|${appUrl}>", "danger", "http://i3.kym-cdn.com/entries/icons/original/000/004/240/CandleCove.jpg", slackChannel)
    throw err
  }
}
