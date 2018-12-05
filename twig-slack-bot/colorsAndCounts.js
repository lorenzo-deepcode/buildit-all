/**
 * Counts the members in each room.
 * Looks at the presence of each member, and based on that adds to away or inactive
 *
 * @param {any} members the members of the chat room
 * @param {any} users the total list of users
 * @returns RequestPromise
 */
function countMembers(members, users) {
  let activeMembers = 0;
  let inactiveMembers = 0;
  members.forEach((member) => {
    if (users[member].presence === 'away') {
      inactiveMembers += 1;
    } else {
      activeMembers += 1;
    }
  });
  return {
    activeMembers,
    inactiveMembers,
  };
}

/**
 * Gets the color that this particular node should be.
 *
 * @param {any} channel the channel being checked for.
 * @param {any} key the node type.
 * @returns RequestPromise
 */
function getColor(channel, key, chatroom) {
  // array is a range based roughly on the channel's size
  if (chatroom && chatroom[key]) {
    if (channel[key] < chatroom[key].failureIfUnder) {
      return '#cc0000';
    } else if (channel[key] < chatroom[key].happinessIfOver) {
      return '#cccc00';
    }
    return '#006600';
  }
  // inactiveMembers and members will always render as blue
  return '#0066ff';
}

/**
 * Gets the color that this particular channel node should be based on if its a studio or tribe.
 *
 * @param {any} channel the channel being checked for.
 * @param {any} key the node type.
 * @returns RequestPromise
 */
function getColorForChannel(channel, chatRoom) {
  // if (chatRooms[channel.type][channel.name].category === 'tribe') {
  if (chatRoom.category === 'tribe') {
    return '#A020F0';
  }
  return '#000000';
}

module.exports = {
  countMembers,
  getColor,
  getColorForChannel,
};
