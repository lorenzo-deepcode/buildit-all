pipelineJob('twig-api-production') {
  definition {
    cpsScm {
      scm {
          git {
            remote {
                github('buildit/twig-api')
                credentials('github-jenkins-buildit')
            }
            branch('master')
        }
      }
      scriptPath('pipelines/production.groovy')
    }
  }
}
pipelineJob('twig-api-backup') {
  description("Nightly backups of CouchDB's onto S3 at https://console.aws.amazon.com/s3/home?region=us-west-2#&bucket=twig-backups")
  triggers {
    cron('0 2 * * *')
  }
  definition {
    cpsScm {
      scm {
          git {
            remote {
                github('buildit/twig-api')
                credentials('github-jenkins-buildit')
            }
            branch('master')
        }
      }
      scriptPath('pipelines/twig-backup.groovy')
    }
  }
}
