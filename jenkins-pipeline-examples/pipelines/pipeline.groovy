node() {
    git poll: false, changelog: false, url: pipelineRepo, credentialsId: "git-credentials", branch: pipelineBranch

    utilities = load "lib/utilities.groovy"
    cloudfoundry = load "lib/cloudfoundry.groovy"
    shell = load "lib/shell.groovy"
    git = load "lib/git.groovy"
    pom = load "lib/pom.groovy"
}

stage 'package'
node() {
    git url: repositoryUrl, credentialsId: "git-credentials", branch: branch
    artifactId = pom.artifactId(pwd() + "/pom.xml")
    version = pom.version(pwd() + "/pom.xml")
    majorVersion = pom.majorVersion(pwd() + "/pom.xml")
    uniqueVersion = version + "." + utilities.timestamp()
    appName = "${artifactId}-${version}".replace(".", "-")
    artifactPath = "target/${artifactId}-${uniqueVersion}.jar"
    commitId = shell.pipe("git rev-parse HEAD")
    sh "mvn -DnewVersion=${uniqueVersion} versions:set"
    sh "mvn package"
    stash includes: "${artifactPath}", name: 'app-artifact'
}

stage 'deploy'
node() {
    unstash 'app-artifact'
    def hostName = "${artifactId}-v${version}".replace(".", "-")
    def majorHostName = "${artifactId}-v${majorVersion}".replace(".", "-")
    cloudfoundry.push(appName, hostName, artifactPath, uniqueVersion, cfSpace, cfOrg, cfApiEndpoint)
    cloudfoundry.mapRoute(appName, majorHostName, cfSpace, cfOrg, cfApiEndpoint)
}

stage 'tag'
node() {
    git poll: false, changelog: false, url: repositoryUrl, credentialsId: "git-credentials", branch: branch
    sh("git checkout ${commitId}")
    sh("git tag -a ${uniqueVersion} -m \"Built version: ${uniqueVersion}\" ${commitId}")
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: "git-credentials", usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
        def authenticatedUrl = git.authenticatedUrl(repositoryUrl, env.USERNAME, env.PASSWORD)
        sh("git remote set-url origin ${authenticatedUrl} &> /dev/null")
        sh("git push origin tag ${uniqueVersion} &> /dev/null")
    }
}
