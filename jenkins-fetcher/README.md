# Jenkins Fetcher

[![Build Status](https://travis-ci.org/buildit/jenkins-fetcher.svg?branch=master)](https://travis-ci.org/buildit/jenkins-fetcher)
[ ![Download](https://api.bintray.com/packages/buildit/maven/jenkins-fetcher/images/download.svg) ](https://bintray.com/buildit/maven/jenkins-fetcher/_latestVersion)

Simple groovy script used by the Buildit [Jenkins Image](https://github.com/buildit/jenkins-image) to download the version of Jenkins specified in a Jenkins Config File. 

The component uses the [Jenkins Config Fetcher](https://github.com/buildit/jenkins-config-fetcher) to provide its configuration. The jenkins version should be specified in the config as follows

```groovy
jenkins {
    version {
        artifactPattern = 'http://ftp-nyc.osuosl.org/pub/jenkins/war/[revision]/[module].[ext]'
        artifact = ":jenkins:2.112@war"
    }
}
```
