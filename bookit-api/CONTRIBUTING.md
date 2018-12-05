# Code Contribution Guidelines

Please adhere to standards where possible, and when not possible, submit a pull request that includes reasons why guidelines could not be followed.

## General Notes

### Architecture decisions
We're using [adr-tools](https://github.com/npryce/adr-tools) to document our decisions.  See [README.md](architecture/decisions/README.md)

#### Commit messages
Please include the JIRA ID in your commit messages (or GitHub issue if tracked that way)

## Testing and Coverage
All code should be covered with unit tests unless it is impractical or provably pointless to do so.

Unit tests should cover known conditions that could occur to a given function, and should evolve over time to include ticket/bug-related cases for the purposes of regression.

While 100% code coverage would be awesome, it is _not_ practical to chase the dragon - a reasonble baseline coverage should be between 60 to 80 percent.

Pull requests will not be accepted without sufficient test coverage.
