_Fruits fail, and love dies, and time ranges; and only the whippersnapper (that fool of Time) endureth for ever._

# Whippersnapper
A little React component library.

## Usage
Declare Whippersnapper as a dependency of your project:
```
npm i --save whippersnapper
```

Then use it in your React code:
```
import React from 'react'
import ReactDOM from 'react-dom'
const Hey = require('whippersnapper/build/Hey.js')

class Thing extends React.Component {
  render() {
    return (
      <div>
        <Hey />
      </div>
    )
  }
}

ReactDOM.render(<Thing />, document.getElementById('app'))
```

## For Whippersnapper developers

### Testing
`npm test` runs the Enzyme tests in the "test" folder.

### Building
`npm run build` converts the code in "src" to widely consumable code and puts it in "build".

### Deployment
We're using Jenkins to handle continuous deployment. See the Jenkinsfile. Right now, it's very basic. It pulls in the latest code and attempts to publish it to npm's registry.

The publish will fail if the version has not been bumped in "package.json". You can modify the version property by hand, but it's preferable to use npm's 'version' command. Here's an example of the workflow:

Do some work. Commit it:
```
git add .
git commit -m "Fix bug"
```

If this work is worthy of a version bump, [bump it](https://docs.npmjs.com/cli/version):
```
npm version patch -m "Fix bug"
```

Push it to the remote repo.

```
git push
```

The next time someone logs in to our Jenkins server and clicks "Build Now", Jenkins will publish the update to npm. Then any project that depends on Whippersnapper will be able to make use of the updated code.
