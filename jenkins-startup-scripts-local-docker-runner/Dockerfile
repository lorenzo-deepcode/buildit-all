FROM builditdigital/jenkins-image:2.5.0-alpine
 
ENV JENKINS_STARTUP_SECRET_FILE=/var/jenkins/.secret_file
ENV JENKINS_STARTUP_SCRIPTS=/var/tmp/jenkins_startup_scripts

ARG CONFIG_FILE_NAME=jenkins.config
ENV JENKINS_CONFIG_FILE=/var/tmp/jenkins_config/$CONFIG_FILE_NAME
 
COPY jenkins-startup-scripts/ /var/tmp/jenkins_startup_scripts/
COPY .secret_file /var/jenkins/.secret_file