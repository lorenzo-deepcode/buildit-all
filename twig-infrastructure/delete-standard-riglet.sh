#!/usr/bin/env bash
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BRANCH=${1:-master}
API_REPO=twig-api
WEB_REPO=twig

# Each delete target asks a Y/N question, so we can't just do make delete-environment
# to do unattended deletions, unfortunately
function deleteEnvironment() {
  echo "Y" | make delete-db ENV=${1}
  echo "Y" | make delete-compute ENV=${1}
  echo "Y" | make delete-foundation ENV=${1}
  make delete-deps ENV=${1}
}

function deleteAppsAndBuild() {
  echo "Y" | make delete-app ENV=integration REPO=${API_REPO} REPO_BRANCH=${BRANCH}
  echo "Y" | make delete-app ENV=staging REPO=${API_REPO} REPO_BRANCH=${BRANCH}
  echo "Y" | make delete-app ENV=production REPO=${API_REPO} REPO_BRANCH=${BRANCH}
  echo "Y" | make delete-build REPO=${API_REPO} REPO_BRANCH=${BRANCH}

  echo "Y" | make delete-app ENV=integration REPO=${WEB_REPO} REPO_BRANCH=${BRANCH}
  echo "Y" | make delete-app ENV=staging REPO=${WEB_REPO} REPO_BRANCH=${BRANCH}
  echo "Y" | make delete-app ENV=production REPO=${WEB_REPO} REPO_BRANCH=${BRANCH}
  echo "Y" | make delete-build REPO=${WEB_REPO} REPO_BRANCH=${BRANCH}
}

cat .make

printf "\n${YELLOW}***${NC} For a clean deletion you must delete the images contained in the ECS repo for this riglet.\n\n"

printf "${RED}This will delete the riglet environment described above.${NC}\n"
read -p "Are you sure you want to proceed?  " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]
then
  deleteAppsAndBuild
  deleteEnvironment integration
  deleteEnvironment staging
  deleteEnvironment production
fi
