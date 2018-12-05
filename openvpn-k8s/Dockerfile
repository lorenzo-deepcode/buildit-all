FROM debian:jessie

# Install openvpn
RUN apt-get update && apt-get -y -o Dpkg::Options::="--force-confnew"  --no-install-recommends install -y \
    openvpn libpam-ldap iptables bash \
    && rm -rf /var/lib/apt/lists/*

# Configuration files
ENV OVPN_CONFIG /etc/openvpn/openvpn.conf
ENV PAM_LDAP_CONFIG /etc/ldap_openvpn.conf

ADD openvpn.conf /etc/openvpn/openvpn.conf
ADD ldap_openvpn.conf /etc/ldap_openvpn.conf
ADD pam.d/openvpn /etc/pam.d/openvpn

# Expose tcp and udp ports
EXPOSE 443/tcp
EXPOSE 443/udp

WORKDIR /etc/openvpn

# entry point takes care of setting conf values
COPY entrypoint.sh /sbin/entrypoint.sh

CMD ["/sbin/entrypoint.sh"]
