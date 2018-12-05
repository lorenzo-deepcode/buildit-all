#!/bin/bash

# create log folder
install  --mode=755 --directory  /var/log/hello-karyon-rxnetty

# start services
systemctl enable hello-karyon-rxnetty
systemctl start hello-karyon-rxnetty




