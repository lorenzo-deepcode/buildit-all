'use strict'

const apiDomain = process.env.ICARUS_API_DOMAIN
if ( !apiDomain ) {
  console.log("ICARUS_API_DOMAIN env variable not defined")
  process.exit(1)
}
console.log('API domain: ', apiDomain)

const lambdaStage = process.env.ICARUS_STAGE || 'dev'
console.log('Lambda stage: ', lambdaStage)


module.exports = {
  NODE_ENV: '"production"',
  LAMBDA_STAGE: `"${lambdaStage}"`,
  API_DOMAIN: `"${apiDomain}"`,
}