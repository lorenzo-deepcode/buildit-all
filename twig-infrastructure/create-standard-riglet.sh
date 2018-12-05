#!/usr/bin/env bash
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BRANCH=${1:-master}

function createEnvironment() {
  echo "Y" | make create-foundation ENV=${1} && \
  echo "Y" | make create-compute ENV=${1} && \
  echo "Y" | make create-db ENV=${1}
}

cat .make

printf  "\n${YELLOW}This command creates a full riglet based on the environment described above.${NC}\n"
read -p "Are you sure you want to proceed?  " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  createEnvironment integration && \
  createEnvironment staging && \
  createEnvironment production && \
  echo "Y" | make create-build REPO=twig-api \
                    REPO_BRANCH=${BRANCH} \
                    CONTAINER_PORT=3000 \
                    HEALTH_CHECK_PATH='/ping' \
                    LISTENER_RULE_PRIORITY=100 && \
  echo "Y" | make create-build REPO=twig \
                    REPO_BRANCH=${BRANCH} \
                    CONTAINER_PORT=80 \
                    HEALTH_CHECK_PATH='/' \
                    LISTENER_RULE_PRIORITY=200
fi
