@Library("buildit")

def pom = new pom()
def date = new date()
def shell = new shell()
def cloudfoundry = new cloudfoundry()
def gitUtil = new git()
def tools = new tools()

stage('init'){
    node(){
        tools.configureMaven("maven-3")
        tools.configureJava("jdk-7")
        tools.configureTool("cf", "")

        repositoryUrl = "https://github.com/buildit/hello-boot.git"
        branch = "master"

        cfOrg = "POC24_Toolbox_Engineering01"
        cfSpace = "development"
        cloudFoundryCredentialsId = "global.cloudfoundry"
        cfApiEndpoint = "${env.'global.CLOUDFOUNDRY_API'}"

        gitUsername = "${env.'global.GIT_USERNAME'}"
        gitEmail = "${env.'global.GIT_EMAIL'}"

        gitCredentialsId = "global.github"

    }
}

stage('package') {
    node() {
        git url: repositoryUrl, credentialsId: gitCredentialsId, branch: branch
        artifactId = pom.artifactId(pwd() + "/pom.xml")
        version = new pom().version(pwd() + "/pom.xml")
        majorVersion = new pom().majorVersion(pwd() + "/pom.xml")
        uniqueVersion = version + "." + date.timestamp()
        appName = "${artifactId}-${version}".replace(".", "-")
        artifactPath = "target/${artifactId}-${uniqueVersion}.jar"
        commitId = shell.pipe("git rev-parse HEAD")
        sh "mvn -DnewVersion=${uniqueVersion} versions:set"
        sh "mvn package"
        stash includes: "${artifactPath}", name: 'app-artifact'
    }
}


stage('deploy'){
    node() {
        unstash 'app-artifact'
        def hostName = "${artifactId}-v${version}".replace(".", "-")
        def majorHostName = "${artifactId}-v${majorVersion}".replace(".", "-")
        cloudfoundry.push(appName, hostName, artifactPath, uniqueVersion, cfSpace, cfOrg, cfApiEndpoint, cloudFoundryCredentialsId)
        cloudfoundry.mapRoute(appName, majorHostName, cfSpace, cfOrg, cfApiEndpoint, cloudFoundryCredentialsId)
    }
}


stage('tag'){
    node() {
        git poll: false, changelog: false, url: repositoryUrl, credentialsId: gitCredentialsId, branch: branch
        gitUtil.configureIdentity(gitUsername, gitEmail)
        sh("git checkout ${commitId}")
        sh("git tag -a ${uniqueVersion} -m \"Built version: ${uniqueVersion}\" ${commitId}")
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: gitCredentialsId, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
            def authenticatedUrl = gitUtil.authenticatedUrl(repositoryUrl, env.USERNAME, env.PASSWORD)
            sh("git remote set-url origin ${authenticatedUrl} &> /dev/null")
            sh("git push origin tag ${uniqueVersion} &> /dev/null")
        }
    }
}


