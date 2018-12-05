# parker-bot
parker-bot helps people remember to keep their harvest timesheets up to date by slacking them if they do not have the correct number of hours.

## Testing

`gradle test` will run the tests

The report for the tests will be located at **./build/reports/tests/test/index.html**

The raw xml for reporting is located at **./build/test-results/test**

## Building

`gradle build` to build a fat jar. Tests are automatically run before build.

Fat jar will be located at **./build/libs/harvest-tattletale-all.jar**

## Config

This project uses a json file for configuration options. See **./config.sample.json** for an example.
* Without the harvestUsername and harvestPassword for a Harvest Admin, this will not be able to get the harvest users.
* Similarly, it will not be able to send any slack messages without the slack token.
* Slack only allows bots to send 1 message per second, hence the timeBetweenSlackMessages key.
* Not all harvest users have the same email in harvest as they do in slack, so emailSlackNames exists to manually map between apps.
* organization is found from your harvest url https://**[organization]**.harvestapp.com/

