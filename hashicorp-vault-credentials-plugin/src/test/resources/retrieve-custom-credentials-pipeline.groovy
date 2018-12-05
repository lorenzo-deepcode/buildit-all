node {
    def username = ""
    def password = ""
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: "custom", usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
        username = "${env.USERNAME}"
        password = "${env.PASSWORD}"

    }
    echo("${username}:${password}")
}