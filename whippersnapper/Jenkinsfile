#!groovy

node {
  stage('Checkout from SCM') {
    checkout(
      [
        $class: 'GitSCM',
        branches: [[name: '*/master']],
        doGenerateSubmoduleConfigurations: false, extensions: [],
        submoduleCfg: [],
        userRemoteConfigs: [[url: 'https://github.com/buildit/whippersnapper']]
      ]
    )
  }

  stage('Validation') {
    sh 'echo "Pretending to validate..."'
  }

  stage('Publish to npm registry') {
    sh 'echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc'
    sh 'npm publish'
  }
}
