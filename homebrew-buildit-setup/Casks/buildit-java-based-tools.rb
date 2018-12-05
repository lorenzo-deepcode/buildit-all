cask 'buildit-java-based-tools' do
  version '0.0.1'
  sha256 :no_check
  url "https://s3.eu-west-2.amazonaws.com/homebrew-buildit-setup/homebrew-buildit-setup.tar.gz"
  name 'Buildit Java Based Tools - Automation of Mac setup as a Cask'

  depends_on cask: "java"
  depends_on cask: "java8"

  depends_on formula: "maven"
  depends_on formula: "gradle"
  depends_on formula: "tomcat"

  caveats do
    <<~EOS
    Manual steps needed and not covered by the cask:

    For Maven config, do:
    Add the following line to your ~/.bash_profile:
      export MAVEN_OPTS="-Xms512m -Xmx512m"

    For Java config, do:
    Add the following lines to your ~/.bash_profile
      alias j9="export JAVA_HOME=`/usr/libexec/java_home -v 9`; java -version"
      alias j8="export JAVA_HOME=`/usr/libexec/java_home -v 1.8`; java -version"
      alias j7="export JAVA_HOME=`/usr/libexec/java_home -v 1.7`; java -version"
    Now you can change which Java version is loaded with the configured aliases.

    EOS
  end
end
