pipelineJob("hello_boot") {
    triggers {
        scm 'H/2 * * * *'
    }
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        url('https://github.com/buildit/sample-pipelines.git')
                    }
                    branch('master')
                }
            }
            scriptPath('pipelines/hello_boot.groovy')
        }
    }
}