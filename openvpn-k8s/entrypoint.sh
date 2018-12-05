#!/bin/bash

if [ "$DEBUG" == "1" ]; then
  set -x
fi

set -e

MORE_OPTS="${MORE_OPTS:-}"
OVPN_NETWORK="${OVPN_NETWORK:-10.140.0.0}"
OVPN_SUBNET="${OVPN_SUBNET:-255.255.0.0}"
OVPN_PROTO="${OVPN_PROTO:-tcp}"
OVPN_NATDEVICE="${OVPN_NATDEVICE:-eth0}"
#OVPN_K8S_SERVICE_NETWORK
#OVPN_K8S_SERVICE_SUBNET
OVPN_K8S_DOMAIN="${OVPN_KUBE_DOMAIN:-cluster.local}"

OVPN_DH="${OVPN_DH:-/etc/openvpn/pki/dh.pem}"
OVPN_CERTS="${OVPN_CERTS:-/etc/openvpn/pki/certs.p12}"

# Autodetect DNS server
OVPN_K8S_DNS=$(cat /etc/resolv.conf | grep -v '^#' | grep nameserver | awk '{print $2}')
# Autodetect domain
OVPN_K8S_DOMAIN=$(cat /etc/resolv.conf | grep -v '^#' | grep search | awk '{$1=""; print $0}')

# Special care because k8s adds extra line break at the end of the secret
LDAP_BIND_PASS=`echo -n "${LDAP_BIND_PASS:-ldap://corp.riglet.io}"`
LDAP_LOGIN_ATTR="${LDAP_LOGIN_ATTR:-CN}"
LDAP_BIND_NAME="${LDAP_BIND_NAME:-CN=ROUSER,CN=Users,DC=corp,DC=riglet,DC=io}"
LDAP_BASE_NAME="${LDAP_BASE_NAME:-CN=Users,DC=corp,DC=riglet,DC=io}"
LDAP_URL="${LDAP_URL:-ldap://corp.riglet.io}"

if [ "$REQUIRE_CERT" = "false" ] ; then
    NO_CERT=""
    if [ "$REQUIRE_PAM" = "false" ] ; then
        echo "Either client certificate or PAM auth must be enabled"
        exit 1
    fi    
else 
    NO_CERT="#"
fi

if [ "$REQUIRE_PAM" = "false" ] ; then
    PAM="#"
else 
    PAM=""
fi

LDAP_URL=`echo "${LDAP_URL:-ldap://corp.riglet.io}" | head -1`

if [ -z "${OVPN_K8S_SERVICE_NETWORK}" ]; then
    echo "Service network not specified"
    exit 1
fi

if [ -z "${OVPN_K8S_SERVICE_SUBNET}" ]; then
    echo "Service subnet not specified"
    exit 1
fi

if [ -z "${OVPN_K8S_DNS}" ]; then
    echo "DNS server not specified"
    exit 1
fi

if [ ! -z "${OVPN_K8S_POD_NETWORK}" -a  ! -z "${OVPN_K8S_POD_SUBNET}" ]; then
    POD_CONF="push \"route ${OVPN_K8S_POD_NETWORK} ${OVPN_K8S_POD_SUBNET}\""
else
    POD_CONF=""
fi

sed 's|{{OVPN_NETWORK}}|'"${OVPN_NETWORK}"'|' -i "${OVPN_CONFIG}"
sed 's|{{OVPN_SUBNET}}|'"${OVPN_SUBNET}"'|' -i "${OVPN_CONFIG}"
sed 's|{{OVPN_PROTO}}|'"${OVPN_PROTO}"'|' -i "${OVPN_CONFIG}"
sed 's|{{OVPN_DH}}|'"${OVPN_DH}"'|' -i "${OVPN_CONFIG}"
sed 's|{{OVPN_CERTS}}|'"${OVPN_CERTS}"'|' -i "${OVPN_CONFIG}"
sed 's|{{OVPN_K8S_SERVICE_NETWORK}}|'"${OVPN_K8S_SERVICE_NETWORK}"'|' -i "${OVPN_CONFIG}"
sed 's|{{OVPN_K8S_SERVICE_SUBNET}}|'"${OVPN_K8S_SERVICE_SUBNET}"'|' -i "${OVPN_CONFIG}"
sed 's|{{OVPN_K8S_DOMAIN}}|'"${OVPN_K8S_DOMAIN}"'|' -i "${OVPN_CONFIG}"
sed 's|{{OVPN_K8S_DNS}}|'"${OVPN_K8S_DNS}"'|' -i "${OVPN_CONFIG}"

sed 's|{{POD_CONF}}|'"${POD_CONF}"'|' -i "${OVPN_CONFIG}"
sed 's|{{MORE_OPTS}}|'"${MORE_OPTS}"'|' -i "${OVPN_CONFIG}"

sed 's|{{PAM}}|'"${PAM}"'|' -i "${OVPN_CONFIG}"
sed 's|{{NO_CERT}}|'"${NO_CERT}"'|' -i "${OVPN_CONFIG}"

sed 's|{{LDAP_URL}}|'"${LDAP_URL}"'|' -i "${PAM_LDAP_CONFIG}"
sed 's|{{LDAP_BASE_NAME}}|'"${LDAP_BASE_NAME}"'|' -i "${PAM_LDAP_CONFIG}"
sed 's|{{LDAP_BIND_NAME}}|'"${LDAP_BIND_NAME}"'|' -i "${PAM_LDAP_CONFIG}"
sed 's|{{LDAP_BIND_PASS}}|'"${LDAP_BIND_PASS}"'|' -i "${PAM_LDAP_CONFIG}"
sed 's|{{LDAP_LOGIN_ATTR}}|'"${LDAP_LOGIN_ATTR}"'|' -i "${PAM_LDAP_CONFIG}"

iptables -t nat -A POSTROUTING -s ${OVPN_NETWORK}/${OVPN_SUBNET} -o ${OVPN_NATDEVICE} -j MASQUERADE

mkdir -p /dev/net
if [ ! -c /dev/net/tun ]; then
    mknod /dev/net/tun c 10 200
fi

if [ "$DEBUG" == "1" ]; then
    echo ========== ${OVPN_CONFIG} ==========
    cat "${OVPN_CONFIG}"
    echo ====================================
fi

exec openvpn --config ${OVPN_CONFIG}
