@Library("buildit")

def pom = new pom()
def date = new date()
def shell = new shell()
def cloudfoundry = new cloudfoundry()
def gitUtil = new git()
def tools = new tools()
def bintray = new bintray()

node() {

    stage('init') {
        tools.configureMaven("maven-3")
        tools.configureJava("jdk-7")
        tools.configureTool("cf", "")

        cloudFoundryCredentialsId = "global.cloudfoundry"
        gitCredentialsId = "global.github"
        repoCredentialsId = 'global.bintray'

        cfOrg = "${env.'global.CLOUDFOUNDRY_ORG'}"
        cfSpace = "${env.'global.CLOUDFOUNDRY_SPACE'}"
        cfApiEndpoint = "${env.'global.CLOUDFOUNDRY_API'}"

        gitUsername = "${env.'global.GIT_USERNAME'}"
        gitEmail = "${env.'global.GIT_EMAIL'}"

    }

    stage('package') {
        checkout scm
        sh("git checkout master && git pull origin master")
        repositoryUrl = shell.pipe("git config --get remote.origin.url")
        artifactId = pom.artifactId(pwd() + "/pom.xml")
        version = pom.version(pwd() + "/pom.xml")
        majorVersion = pom.majorVersion(pwd() + "/pom.xml")
        uniqueVersion = version + "." + date.timestamp()
        appName = "${artifactId}-${version}".replace(".", "-")
        artifactPath = "target/${artifactId}-${uniqueVersion}.jar"
        commitId = shell.pipe("git rev-parse HEAD")
        sh "mvn -DnewVersion=${uniqueVersion} versions:set"
        sh "mvn clean package"
    }

    stage('tag') {
        gitUtil.configureIdentity(gitUsername, gitEmail)
        sh("git checkout ${commitId}")
        sh("git tag -a ${uniqueVersion} -m \"Built version: ${uniqueVersion}\" ${commitId}")
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: gitCredentialsId, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
            def authenticatedUrl = gitUtil.authenticatedUrl(repositoryUrl, env.USERNAME, env.PASSWORD)
            sh("git remote set-url origin ${authenticatedUrl} &> /dev/null")
            sh("git push origin tag ${uniqueVersion} &> /dev/null")
        }
    }

    stage('archive') {
        bintray.upload(repoCredentialsId, artifactId, uniqueVersion, 'jar', 'target/*.jar', 'buildit', 'maven')
    }

    stage('deploy') {
        def hostName = "${artifactId}-v${version}".replace(".", "-")
        def majorHostName = "${artifactId}-v${majorVersion}".replace(".", "-")
        cloudfoundry.push(appName, hostName, artifactPath, uniqueVersion, cfSpace, cfOrg, cfApiEndpoint, cloudFoundryCredentialsId)
        cloudfoundry.mapRoute(appName, majorHostName, cfSpace, cfOrg, cfApiEndpoint, cloudFoundryCredentialsId)
    }
}
