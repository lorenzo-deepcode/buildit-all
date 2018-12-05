# Encryptor Api

[![Build Status](https://travis-ci.org/buildit/encryptor-api.svg?branch=master)](https://travis-ci.org/buildit/encryptor-api)
[ ![Download](https://api.bintray.com/packages/buildit/maven/encryptor-api/images/download.svg) ](https://bintray.com/buildit/maven/encryptor-api/_latestVersion)
[![Docker Pulls](https://img.shields.io/docker/pulls/builditdigital/encryptor-api.svg)](https://hub.docker.com/r/builditdigital/encryptor-api/)

Simple ui and rest api for the Buildit [Encrytor](https://github.com/buildit/encryptor).

## Running it

### Docker
To use the image run

```
docker run -it -p 4567:4567 builditdigital/encryptor-api:2.3.0
```
and navigate to [http://localhost:4567/](http://localhost:4567/)

### Kubernetes
```
kubectl run encryptor --image builditdigital/encryptor-api:2.3.0 --port 4567
kubectl expose deployment encryptor --type "LoadBalancer"
```


