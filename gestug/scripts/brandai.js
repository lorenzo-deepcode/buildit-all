'use strict';

// import requisition from 'requisition';

var BRANDAI_INTEGRATION_USER_NAME = 'Brand.ai';

// const brandaiBuild = async () => {
//   requisition.post('https://circleci.com/api/v1.1/project/github/buildit/gestug/tree/master?circle-token=efbf867e30b8f5cc8d4de6621c0adfa2a32c7716')
// }
var kickoffBrandaiUpdate = function kickoffBrandaiUpdate(res) {
  // room G4W67C7E2
  res.send('I am in the ' + res.message.room + ' room');
  res.send('I detected a change in design library ' + res.match[1] + '.  Kicking off updates.');
  if (res.message.user.name === BRANDAI_INTEGRATION_USER_NAME) {
    res.send('I heard you, Brand.ai!');
  } else {
    res.send('You can\'t trick me, you\'re not a bot!');
  }
};

var kickoffManualBrandaiUpdate = function kickoffManualBrandaiUpdate(res) {
  // token efbf867e30b8f5cc8d4de6621c0adfa2a32c7716
  // POST to https://circleci.com/api/v1.1/project/github/buildit/gestug/tree/master?circle-token=
  if (res.message.user.name !== BRANDAI_INTEGRATION_USER_NAME) {
    res.send('Okay, ' + res.message.user.name + ', kicking off a new build.');
  }
};

var setupRobot = function setupRobot(robot) {
  robot.hear(/The color .* was changed in the (.*) design library/, kickoffBrandaiUpdate);
  robot.hear(/A color was added to the (.*) design library/, kickoffBrandaiUpdate);
  robot.hear(/A color was changed in the (.*) design library/, kickoffBrandaiUpdate);
  robot.hear(/A color was removed from the (.*) design library/, kickoffBrandaiUpdate);
  robot.hear(/The font family .* was added to the (.*) design library/, kickoffBrandaiUpdate);
  robot.hear(/The (logo|icon|image) .* was added to the (.*) design library/, kickoffBrandaiUpdate);

  robot.hear(/kickoff brandai/, kickoffManualBrandaiUpdate);
};

module.exports = setupRobot;