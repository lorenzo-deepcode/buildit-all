# Taco Components
A React components library for Project T.A.C.O.

## Usage
```
npm install --save taco-components
```

Then, in your React file:
```
import { QuantityPicker } from 'taco-components'
```

## For developers of Taco Components
We're using Travis to handle continuous deployment. Right now, it's very basic. It pulls in the latest code and attempts to publish it to npm's registry.

The publish only happens on tagged commits. Use npm's 'version' command to do the version tags. Here's a sample workflow:

Do some work. Commit it:
```
git add .
git commit -m "Fix bug"
```

If this work is worthy of a version bump, [bump it](https://docs.npmjs.com/cli/version):
```
npm version patch -m "Fix bug"
```

We're using pre and post version hooks (see package.json) to validate and push the code to the remote repo.

Travis is configured to run the job whenever a new commit is pushed to the remote repository. At that point, the new version will be published to npm, and any project that depends on Taco Components will be able to make use of the updated code.
