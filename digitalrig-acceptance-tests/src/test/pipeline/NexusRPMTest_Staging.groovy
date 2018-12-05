node {
    sh "rm -f *.rpm"
    env.TIMESTAMP = new Date().time
    writeFile(file: 'sample', text: "this is a test file")
    sh "/usr/local/bin/fpm -s dir -t rpm -n nexus-test -v ${TIMESTAMP} -a all sample"
    catchError {
        // upload
        sh "curl -v -u admin:admin123 --upload-file nexus-test-${TIMESTAMP}-1.noarch.rpm ${STAGING_NEXUS}"
        // check
        sh "wget ${STAGING_NEXUS}/nexus-test-${TIMESTAMP}-1.noarch.rpm"
    }
    // cleanup
    sh "curl --request DELETE -u admin:admin123 ${STAGING_NEXUS}/nexus-test-${TIMESTAMP}-1.noarch.rpm"
}