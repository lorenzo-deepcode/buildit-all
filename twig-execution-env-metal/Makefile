include .make

ENV ?= tst
KEY_NAME ?= ""
NAME_SUFFIX ?= jdoe
PROFILE ?= default
PROJECT ?= myapp
REGION ?= us-east-1

export AWS_PROFILE=$(PROFILE)
export AWS_DEFAULT_REGION=$(REGION)


## Ensure dependency S3 bucket is created
# Creates S3 bucket for storing CF templates
deps:
	aws s3 mb s3://metalrig.$(NAME_SUFFIX).$(REGION)


## Creates a new CF stack
create: upload
	aws cloudformation create-stack --stack-name "$(PROJECT)-$(ENV)-$(NAME_SUFFIX)" \
		--template-body "file://main.yaml" \
		--disable-rollback \
		--capabilities CAPABILITY_NAMED_IAM \
		--parameters \
			"ParameterKey=TemplateBucket,ParameterValue=metalrig.$(NAME_SUFFIX)/$(PROJECT)/$(ENV)" \
			"ParameterKey=ProjectName,ParameterValue=$(NAME_SUFFIX)-$(PROJECT)-$(ENV)"


## Update existing CF stack
update: upload
	aws cloudformation update-stack --stack-name "$(PROJECT)-$(ENV)-$(NAME_SUFFIX)" \
		--template-body "file://main.yaml" \
		--capabilities CAPABILITY_NAMED_IAM \
		--parameters \
			"ParameterKey=TemplateBucket,ParameterValue=metalrig.$(NAME_SUFFIX)/$(PROJECT)/$(ENV)" \
			"ParameterKey=ProjectName,ParameterValue=$(NAME_SUFFIX)-$(PROJECT)-$(ENV)"


## Deletes the CF stack
delete:
	aws cloudformation delete-stack --stack-name "$(PROJECT)-$(ENV)-$(NAME_SUFFIX)"


## Print this stack's status
status:
	aws cloudformation describe-stacks \
		--stack-name "$(PROJECT)-$(ENV)-$(NAME_SUFFIX)" \
		--query "Stacks[][StackStatus] | []"


## Upload CF Templates to S3
upload:
	aws s3 cp templates/couchdb-ami.yaml s3://metalrig.$(NAME_SUFFIX)/$(PROJECT)/$(ENV)/templates/
	aws s3 cp templates/ecs-cluster.yaml s3://metalrig.$(NAME_SUFFIX)/$(PROJECT)/$(ENV)/templates/
	aws s3 cp templates/load-balancer.yaml s3://metalrig.$(NAME_SUFFIX)/$(PROJECT)/$(ENV)/templates/
	aws s3 cp templates/vpc.yaml s3://metalrig.$(NAME_SUFFIX)/$(PROJECT)/$(ENV)/templates/


## Print this help
help:
	@awk -v skip=1 \
		'/^##/ { sub(/^[#[:blank:]]*/, "", $$0); doc_h=$$0; doc=""; skip=0; next } \
		 skip  { next } \
		 /^#/  { doc=doc "\n" substr($$0, 2); next } \
		 /:/   { sub(/:.*/, "", $$0); printf "\033[34m%-30s\033[0m\033[1m%s\033[0m %s\n\n", $$0, doc_h, doc; skip=1 }' \
		$(MAKEFILE_LIST)

.make:
	@touch .make

.DEFAULT_GOAL := help
.PHONY: help
.PHONY: deps create update delete status upload
