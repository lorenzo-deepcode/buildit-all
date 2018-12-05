const R = require('ramda');
const moment = require('moment');
require('moment-timezone');
const log4js = require('log4js');
const config = require('./config');
const { getAllUsers, getAllChannels, createNodesAndLinks, getScaleFunctions } = require('./slackInformation');
const { login, patchTwiglet, createEvent } = require('./apiCalls');

const logger = log4js.getLogger();

/**
 * Gets a summary of the slack status at the current time.
 *
 */
function getSummary() {
  let users = {};
  let channels = {};
  const now = moment(new Date()).utc();
  const timeIntervalAgo = now.subtract(config.totalInterval, 'second').unix();

  // Get the users from slack
  getAllUsers(config.token)
  .then((usersResults) => {
    users = usersResults.members.reduce((object, member) =>
      Object.assign(object, { [member.id]: member }), {});
  })
  // Get the channels from slack.
  .then(() => getAllChannels(config.token, users, timeIntervalAgo, config.chatRooms, 'channel')
    .then((channelsFromSlack) => {
      channels = channelsFromSlack;
    }))
  .then(() => getAllChannels(config.token, users, timeIntervalAgo, config.chatRooms, 'group')
    .then((groups) => {
      channels = R.merge(channels, groups);
    }))
  .then(() => {
    let twiglet = {
      commitMessage: `${now.format('HH')}:00 event created`,
      nodes: [],
      links: [],
    };
    Reflect.ownKeys(channels)
      .map(key => channels[key])
      .forEach((channel) => {
        twiglet = createNodesAndLinks(twiglet,
                            channel,
                            getScaleFunctions(channels),
                            config.chatRooms[channel.type][channel.name]);
      });
    return login()
    .then(() => patchTwiglet(twiglet))
    .then(() => createEvent(now.toLocaleString()))
    .then(() => logger.log('snapshot placed'));
  })
  .catch(error => logger.error(error));
}

getSummary();

setInterval(getSummary, config.interval * 1000);

