# Document Search Infrastructure With Terraform

Infrastructure for Document Search Application

## Deploying

```
terraform init
terraform workspace select prod
terraform apply -var env=`(terraform workspace show)`
```

## Testing changes

```
git checkout -b <branch>
terraform workspace new `(git rev-parse --abbrev-ref HEAD)`
terraform plan -var env=`(terraform workspace show)`
terraform apply -var env=`(terraform workspace show)`
```

## Teardown

```
terraform destroy -var env=`(terraform workspace show)`
```