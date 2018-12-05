import Helper from 'hubot-test-helper';

import nock from 'nock';

import mocha from 'mocha';
import coMocha from 'co-mocha';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

coMocha(mocha);
chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const helper = new Helper('../../src/es6/achewood.js');

const achewoodUrl = 'http://achewood.com';
const achewoodData = (date, title) => ({
  date,
  path: date === '12262016' ? '/' : `/index.php?date=${date}`,
  src: `/comic.php?date=${date}`,
  title,
  srcFQ: `${achewoodUrl}/comic.php?date=${date}#.png`,
});
const achewoodBody = data => (`<img class="comic" src="${data.src}" title="${data.title}" />`);

const achewoodLatest = achewoodData('12252016', 'This is the latest strip');
const achewoodSaddest = achewoodData('06022003', 'This is the saddest thing');
const achewoodSearch = achewoodData('01012016', 'This is the search strip');
const achewoodDate = achewoodData('10012001', 'This is the date lookup');
const achewoodRandom = achewoodData('01252006', 'This is a random strip');

const achewoodSearchTerm = 'foo';

describe('Achewood plugin', () => {
  let room;
  beforeEach(() => {
    room = helper.createRoom();

    nock(achewoodUrl)
      .get('/').reply(200, achewoodBody(achewoodLatest))
      .get('/index.php')
      .query({ date: /06022003|11052001|09052006|07302007|12102001/ })
      .reply(200, achewoodBody(achewoodSaddest))
      .get('/index.php')
      .query({ date: achewoodRandom.date })
      .reply(200, achewoodBody(achewoodRandom))
      .get('/index.php')
      .query({ date: achewoodDate.date })
      .reply(200, achewoodBody(achewoodDate))
      .get('/index.php')
      .query({ date: achewoodSearch.date })
      .reply(200, achewoodBody(achewoodSearch));

    nock('http://www.ohnorobot.com')
      .get('/random.php?comic=636')
      .delay(0)
      .reply(302, '', {
        Location: `${achewoodUrl}/index.php?date=${achewoodRandom.date}`,
      })
      .get(`/index.php?comic=636&lucky=1&s=${achewoodSearchTerm}`)
      .delay(0)
      .reply(302, '', {
        Location: `${achewoodUrl}/index.php?date=${achewoodSearch.date}`,
      });
  });
  afterEach(() => {
    room.destroy();
  });

  const generateTest = (phrase, data) => (
    async () => {
      const user = 'user';
      const userSay = `@hubot ${phrase}`;
      const correct = [
        [user, userSay],
        ['hubot', data.srcFQ],
        ['hubot', data.title],
      ];

      await room.user.say(user, userSay);

      return new Promise(resolve => {
        setTimeout(() => {
          expect(room.messages).to.deep.equal(correct);
          resolve();
        }, 100);
      });
    }
  );

  it('looks up the saddest thing', generateTest('saddest thing', achewoodSaddest));
  it('looks up the latest comic', generateTest('achewood latest', achewoodLatest));
  it('looks up a topic', generateTest(`achewood ${achewoodSearchTerm}`, achewoodSearch));
  it('looks up a comic by date', generateTest(`achewood ${achewoodDate.date}`, achewoodDate));
  it('looks up a random comic', generateTest('achewood', achewoodRandom));
});
