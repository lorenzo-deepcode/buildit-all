node() {
    assert sh(script: 'mvn --version', returnStdout: true).contains('Maven 3.3')
}