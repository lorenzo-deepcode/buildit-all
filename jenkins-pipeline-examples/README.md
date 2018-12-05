# Jenkins Pipeline Examples

Sample maven project including a couple of Jenkins Pipeline scripts. See the included pptx file for the associated presentation.

To set up a pipeline for the hello-boot application in Jenkins use the following

```groovy
pipelineRepo = "https://github.com/buildit/jenkins-pipeline-examples.git"
pipelineBranch = "stable"
script = "pipelines/pipeline.groovy"

repositoryUrl = "https://github.com/buildit/hello-boot.git"
branch = "master"
cfApiEndpoint = "<cf-api-endpoint>"
cfOrg = "<cf-org>"
cfSpace = "<cf-space>"

node () {
    git poll: false, changelog: false, url: pipelineRepo, credentialsId: "git-credentials", branch: pipelineBranch
    load script    
}
```

To set up a pipeline for the meta-pipeline in Jenkins use the following

```groovy
repositoryUrl = "https://github.com/buildit/jenkins-pipeline-examples.git"
script = "pipelines/meta-pipeline.groovy"
branch = "development"

source = "development"
target = "stable"

node () {
    git url: repositoryUrl, credentialsId: "git-credentials", branch: branch
    load script    
}
```
