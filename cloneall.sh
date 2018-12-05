#! /bin/bash

CNTX=$1
if [ "$CNTX" != "users" -a "$CNTX" != "orgs" ]; then
  echo "First parameter must be 'users' or 'orgs'."
  exit 0
fi

NAME=$2
if [ -z "$NAME" ]; then
  echo "Second parameter must be the account name."
  exit 0
fi

PAGE=1

REPOS=`curl "https://api.github.com/$CNTX/$NAME/repos?page=$PAGE&per_page=100" | grep -e 'git_url*' | cut -d \" -f 4`

while [ -n "$REPOS" ] ; do
  echo "$REPOS" | xargs -L1 git clone

  let PAGE=$PAGE+1
  
  REPOS=`curl "https://api.github.com/$CNTX/$NAME/repos?page=$PAGE&per_page=100" | grep -e 'git_url*' | cut -d \" -f 4`
done





