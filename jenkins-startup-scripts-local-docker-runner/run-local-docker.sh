#!/bin/bash

usage() {
    echo 'Usage: run-local-docker.sh <config-file-location> <startup-scripts-location>'
    echo ''
    echo 'Runs a local Jenkins instance in a Docker container, with these startup scripts, and a defined config file.'
    echo 'Required arguments:'
    echo '  config-file-location - the path to a local jenkins.config.'
    echo '  startup-scripts-location - the path to a local copy of the jenkins-startup-scripts.'
    echo ''
    echo 'The encryption secret can be set as an environment variable JENKINS_STARTUP_SECRET. If no such variable'
    echo 'is set, the secret will be read in as part of this script.'
}

if [[ $# -ne 2  ]] ; then
    usage
    exit 1
fi

CONFIG_FILE_LOC=$1
SCRIPTS_LOC=$2

if [[ -z "${JENKINS_STARTUP_SECRET}" ]]; then
    echo -n "Tell me your secret > "
    read -s SECRET
    echo ""
else
    SECRET="${JENKINS_STARTUP_SECRET}"
fi

# Build jenkins-startup-scripts, and unzip the output here.
$SCRIPTS_LOC/gradlew -p $SCRIPTS_LOC clean
$SCRIPTS_LOC/gradlew -p $SCRIPTS_LOC build -x test
unzip $SCRIPTS_LOC/build/libs/*.zip -d $(pwd)/jenkins-startup-scripts

CONFIG_FILE_NAME=$(basename $CONFIG_FILE_LOC)

# Set up the config file location (to be mapped to the Docker container).
if [[ $CONFIG_FILE_LOC == *.config ]]; then
    CONFIG_FILE_LOC=$(dirname $CONFIG_FILE_LOC)
fi

# Create the secret file.
echo $SECRET > .secret_file

# Build the Docker image.
docker build -t local-jenkins-image --build-arg CONFIG_FILE_NAME=$CONFIG_FILE_NAME .

# Tidy up after ourselves to avoid any future conflicts.
rm -rf jenkins-startup-scripts
rm .secret_file

# Run (and delete) the Docker image.
docker run -p 8080:8080 -p 50000:50000 -v $CONFIG_FILE_LOC:/var/tmp/jenkins_config --rm local-jenkins-image

