# builditdigital/openvpn-k8s

- [Introduction](#introduction)
- [Contributing](#contributing)
- [Prerequisites](#prerequisites)
- [Helm-based installation](#helm-based-installation)
- [Manual Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration Parameters](#configuration-parameters)
- [OpenVPN LDAP authentication](#openvpn-ldap-authentication)
- [LDAP authentication troubleshooting](#ldap-authentication-troubleshooting)

# Introduction

Dockerfile to run [openvpn](https://openvpn.net/) inside [kubernetes](http://kubernetes.io/).

Features:
- Client certificate authentication
- LDAP name/password authentication
- Option to push routes to the host and pod subnets
- DNS server and default domain name are inherited from the pod configuration

# Contributing

If you find this image useful you can help by doing one of the following:

- *Send a Pull Request*: you can add new features to the docker image, which will be integrated into the official image.
- *Report a Bug*: if you notice a bug, please issue a bug report at [Issues](https://github.com/builditdigital/openvpn-k8s/issues), so we can fix it as soon as possible.

# Helm-based installation

Check [electroma/charts](https://github.com/electroma/charts/tree/master/digitalrig/openvpn-k8s) repository. 

# Manual Installation

Automated builds of the image are available on [Dockerhub](https://hub.docker.com/r/electroma/openvpn-k8s) and is the recommended method of installation.

```bash
docker pull builditdigital/openvpn-k8s:latest
```

Alternatively you can build the image locally.

```bash
git clone https://github.com/electroma/openvpn-k8s.git
cd openvpn
docker build -t builditdigital/openvpn-k8s .
```

# Quick Start

This image was created to simply have openvpn access to kubernetes cluster.

First you will need to create [secret volume](http://kubernetes.io/v1.1/docs/user-guide/secrets.html) with dh params and server certificate in pkcs12 format.

- Create kubernetes secret volume:

`openvpn-secrets.yaml` file:

```
apiVersion: v1
kind: Secret
metadata:
  name: openvpn
data:
  dh.pem: <base64_encoded_dh_pem_file>
  certs.p12: <base64_encoded_certs_file>
```

    kubectl create -f openvpn-secrets.yaml

- Create kubernetes replication controller:

`openvpn-controller.yaml` file:

```
apiVersion: v1
kind: ReplicationController
metadata:
  name: openvpn
  labels:
    name: openvpn
spec:
  replicas: 2
  selector:
    name: openvpn
  template:
    metadata:
      labels:
        name: openvpn
    spec:
      containers:
        - name: openvpn
          image: builditdigital/openvpn-k8s
          securityContext:
            capabilities:
              add:
                - NET_ADMIN
          env:
            - name: OVPN_NETWORK
              value: 10.240.0.0
            - name: OVPN_SUBNET
              value: 255.255.0.0
            - name: OVPN_PROTO
              value: tcp
            - name: OVPN_K8S_SERVICE_NETWORK
              value: 10.241.240.0
            - name: OVPN_K8S_SERVICE_SUBNET
              value: 255.255.240.0
            - name: OVPN_K8S_DNS
              value: 10.241.240.10
            - name: REQUIRE_PAM
              value: false
            - name: REQUIRE_CERT
              value: true
          ports:
            - name: openvpn
              containerPort: 443
          volumeMounts:
            - mountPath: /etc/openvpn/pki
              name: openvpn
      volumes:
        - name: openvpn
          secret:
            secretName: openvpn
```

- Create kubernetes service:

`openvpn-service.yaml` file:

```
kind: Service
apiVersion: v1
metadata:
  name: openvpn
spec:
  ports:
    - name: openvpn
      port: 443
      targetPort: 443
  selector:
    name: openvpn
  type: LoadBalancer
```

    kubectl create -f openvpn-service.yaml

# Configuration Parameters

Below is the complete list of available options that can be used to customize your packetbeat container instance.

- **OVPN_NETWORK**: Network allocated for openvpn clients (default: 10.240.0.0).
- **OVPN_SUBNET**: Network subnet allocated for openvpn client (default: 255.255.0.0).
- **OVPN_PROTO**: Protocol used by openvpn tcp or udp (default: udp).
- **OVPN_NATDEVICE**: Device connected to kuberentes service network (default: eth0).
- **OVPN_K8S_SERVICE_NETWORK**: Kubernetes service network (required).
- **OVPN_K8S_SERVICE_SUBNET**: Kubernetes service network subnet (required).
- **OVPN_K8S_DH**: Openvpn dh.pem file path (default: /etc/openvpn/pki/dh.pem).
- **OVPN_K8S_CERTS**: Openvpn certs.p12 file path (default: /etc/openvpn/pki/certs.p12).
- **MORE_OPTS**: Misc Openvpn options, one per line, for example `duplicate-cn`
- **OVPN_K8S_POD_NETWORK**: Kubernetes pod network (optional).
- **OVPN_K8S_POD_SUBNET**: Kubernetes pod network subnet (optional).
- **REQUIRE_PAM**: Use PAM LDAP name/password authentication (optional, default is `true`).
- **REQUIRE_CERT**: Use client certificate authentication (optional, default is `true`).
- **LDAP_URL**: LDAP URL, uses prefix `ldap://` or `ldaps://` (optional, ).
- **LDAP_BIND_NAME**: LDAP bind object (optional, default is `CN=ROUSER,CN=Users,DC=corp,DC=riglet,DC=io`).
- **LDAP_BIND_PASS**: LDAP bind object password (optional).
- **LDAP_BASE_NAME**: LDAP base path (optional, default is `CN=Users,DC=corp,DC=riglet,DC=io`).
- **LDAP_LOGIN_ATTR**: User name LDAP attribute to be mapped (optional, default is `CN`).


# OpenVPN LDAP authentication

Idea is to use openvpn to access private development environment.

First idea was to use `openvpn-auth-ldap` module. Unfortunately it is not well supported and fails with segfault on modern linux builds.

So we're using `openvpn-plugin-auth-pam` instead.

# LDAP authentication troubleshooting

In case it does not work and you do not know why...

- Get shell in the container (either connect to running container or start sandbox with smth like `docker run --rm -ti -P --privileged --env-file env  -v `pwd`/keys/vpn.p12:/etc/openvpn/pki/certs.p12 -v `pwd`/keys/dh.pem:/etc/openvpn/pki/dh.pem  builditdigital/openvpn-ad bash`)
- Enable logging for LDAP client (see `auth-ldap.conf`)
- Install `apt-get install ldap-utils` and play with `ldapsearch -h 10.10.243.23 -D "CN=Administrator,CN=Users,DC=corp,DC=riglet,DC=io" -w PASS -b "CN=Users,dc=corp,dc=riglet,dc=io"`
