# Jenkins Startup Scripts Local Docker Runner

This script allows you to run a Jenkins instance that is configured using a local configuration file and set of startup scripts.

### Dependencies
* Local clone of [Jenkins startup scripts](https://github.com/buildit/jenkins-startup-scripts)
* A Jenkins config file (example can be found [here](https://github.com/buildit/jenkins-config))

### Running the script

Command: `./run-local-docker.sh <config-file-location> <startup-scripts-location>`

`<config-file-location>` should point to your `jenkins.config` file.

`<startup-scripts-location>` should point to the root of your copy of jenkins-startup-scripts.

### Secret

The run-local-docker.sh script will automatically use the JENKINS_STARTUP_SECRET from your local environment. If this is not set then it will prompt you to enter it.

### Changing the port

By default, Jenkins will run on `localhost:8080`. If you want/need to change the port, change the following line in `run-local-docker.sh`:

`docker run -p <DESIRED_PORT>:8080 -p 50000:50000 --rm local-jenkins-image`