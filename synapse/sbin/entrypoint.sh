#!/bin/bash

if [ "$DEBUG" == "1" ]; then
  set -x
fi

if [ -z "${SERVER_CONF}" ]; then
    echo "Server configuration is not specified! Falling back to black magic"
fi

set -e

sed -i "s~SERVER_CONF~$SERVER_CONF~" /usr/src/app/index.html && nginx
