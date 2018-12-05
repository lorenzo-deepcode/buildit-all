# job-listings
Small JS library for fetching Buildit job listings data from SmartRecruiter's API.

## Installation

```sh
npm install --save @buildit/job-listings
```

## Usage

```js
// Import library
const JobListings = require('@buildit/job-listings');

// Fetch the latest Buildit job listings from SmartRecruiters' API.
// Note that getBuilditJobPostings() returns a Promise, which resolves
// to an array of job postings.
JobListings.getBuilditJobPostings()
  .then((jobs) => {
    jobs.forEach((job) => {

      console.log(job.title);
      // E.g. "Software Engineer"

      console.log(job.experienceLevel);
      // E.g. "Mid-Senior Level"
      
      console.log(job.typeOfEmployment);
      // E.g. "Full-time"

      console.log(job.location.city);
      // E.g. "Dublin"

      console.log(job.location.country);
      // E.g. "Ireland"

      console.log(job.url);
      // Outputs full URL to job ad page on SmartRecruiters,
      // including the "Buildit website" tracking ID.
    });
  })
  .catch((err) => {
    // Handle errors
  });
```

Currently, the library only exports the asynchronous `getBuilditJobPostings()` function. More functionality may be added in future - please raise an issue or a PR to let us know what you need.

## Development

### Setup

1. Make sure you are using correct Node version (8.x LTS aka "Carbon" or later)
    * If you have NVM, you can do `nvm use`
1. Install dev dependencies
    * `npm install`

...and you're all set!

### Coding conventions

The source code is located in the `src/` directory. It's ES6 style JavaScript and follows [AirBnb's coding standards](https://github.com/airbnb/javascript).

Our [Jest](https://facebook.github.io/jest/) unit tests sit in the `__tests__` folder and use the following file naming convention: `[module name].test.js`. We have 100% code coverage and aim to maintain that.

### Building

We use [Babel](https://babeljs.io/) to transpile into Node-compatible, CommonJS-style code for distribution via NPM:

```sh
npm run build
```

You can also watch the source files and automatically transpile them on changes:

```sh
npm run watch
```

### Linting and testing

To lint the code:

```sh
npm run lint
```

To run tests:

```sh
npm run test
```

### Contributing

Contributions of all shapes and sizes are welcome!

If you create PRs, please make sure you're code lints and tests with no errors before asking for a review. Thanks!
