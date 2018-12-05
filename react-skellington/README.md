# react-skellington
A basic skeleton for a React app with - of course - some basic assumptions and opinions

Uses webpack2, webpack dev server + hot module reloading.

Assumes you want a react app that uses Redux, Redux-Saga, React-Router and Redux-Form.

Also assumes you're going to be writing code in an es6-kinda way, using SASS and doing some object-rest-spread fun.

Also also assumes you want Moment.js.

# SKELLINGTON!

This is the _minimal_ set of dev dependencies I found that worked for my requirements - I wanted to write my webpack config as es6, I wanted webpack dev server, hot module reloading and some kind of production build.

## QUICK START

Use of *yarn* over *npm* is _highly_ encouraged. Just run `yarn install` and you're good to go.

If instead you opt to use npm, use `npm install` and then don't come crying to me that something horrible is broken, because you can't trust npm to give you what you actually asked for.

- For development, run `npm run dev`
- For production build, run `npm run build`
- Run tests with `npm test`
- Lint javascript and styles with `npm run lint` and `npm run lint:style` respectively, or do both with `npm run lint`.

## GOALS

- To _understand_ why a dependency is a dependency, not just blindly include it because some tutorial said to
- To _document_ why dependencies are included, and what their inclusion actually entails
- To aggressively gut dependencies until the absolute working core remains
- To divide configuration between two states: *visible* and *protected*
  - Where *visible* configuration is open about what it is doing and is open to change, and
  - *protected* configuration is documented, but discourages manipulation unless it is discovered to be a flaw in the skeleton.

## TODO

- Clean up webpack config (inc. per-environment setup)
- ~Verify requirment of specific babel plugins that seem dubious~
- ~Clean up eslint rules~
- Add contrived redux-saga example to verify HMR
- Refactor directory structure for redux and sagas related modules
- Add various css (postcss, whatever) webpack loaders/rules
- ~Add test harness - most likely involving mocha, chai and enzyme (enzyme wraps jsdom, so that is acceptable)~
- ~Decouple config from package.json~
- ~Decouple application paths from package.json~
