node {
    git url: 'https://github.com/electroma/digitalrig-acceptance-tests.git'
    dir('./src/test/apps/node-docker') {
        sh 'npm install && npm run dist'
        def sampleContainer = docker.build 'my-environment:snapshot'
        sampleContainer.withRun('-p 18080:80') {
            sh "URL=localhost:18080# xvfb-run -d -s \"-screen 0 1440x900x24\" npm run test:e2e"
        }
    }
}