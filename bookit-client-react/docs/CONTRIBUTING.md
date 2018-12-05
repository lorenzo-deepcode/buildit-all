# Code Contribution Guidelines

Please adhere to standards where possible, and when not possible, submit a pull request that includes reasons why guidelines could not be followed.

## General Notes

#### index.js
Unless it is not possible to do so, only use `index.js` in the context of collecting exports from other modules within the same directory for re-exporting.

It is important to note that because of the expected usage of index.js files as export points, Jest is configured to exclude _any_ index.js found under the `src` directory. Again, if you have a special case that requires an index.js to be included for code coverage, you will have to modify the [the `collectCoverageFrom` section in .jestrc.json](https://github.com/buildit/bookit-client-react/blob/fde3018/.jestrc.json#L24).

Note that whilst index.js files are excluded from coverage reports, they are _not_ excluded from having tests run against them _if_ they exist.

## Imports and Exports

This project makes use of webpack aliasing for _most_ directories under `src`.

The aliases themselves are simply capitalized versions of their actual name (eg. `src/actions` becomes `Actions` when importing).

For the full list of aliases, see the [`resolve.alias` section in webpack.config.js](https://github.com/buildit/bookit-client-react/blob/fde3018/webpack.config.js#L44)

**NOTE** Jest does not make direct use of webpack and so to ensure tests can actually run, [the `moduleNameMapper` section in .jestrc.json](https://github.com/buildit/bookit-client-react/blob/fde3018/.jestrc.json#L5) must include the same aliases defined within the `resolve.alias` section of the webpack config mentioned above.

For example:
```javascript
// webpack.config.js
ActionTypes: path.join(__dirname, 'src/constants/actionTypes')

// .jestrc.json
"^ActionTypes(.*)$": "<rootDir>/src/constants/actionTypes$1",
```

## Testing and Coverage
All code should be covered with unit tests unless it is impractical or provably pointless to do so.

Unit tests should cover known conditions that could occur to a given function, and should evolve over time to include ticket/bug-related cases for the purposes of regression.

While 100% code coverage would be awesome, it is _not_ practical to chase the dragon - a reasonble baseline coverage should be between 60 to 80 percent.
