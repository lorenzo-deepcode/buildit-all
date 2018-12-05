# icarus

> Icarus site

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report

# run the e2e tests using testcafe in chrome
yarn e2e

Note: Set `ICARUS_E2E_TARGET` as the target URL for the end-to-end tests (e.g.: _http://localhost:8080_)
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Icarus Lambda stage

`yarn dev` and `yarn build` both expect the `ICARUS_STAGE` environment variable to define the lambda stage. `'dev'` is the default