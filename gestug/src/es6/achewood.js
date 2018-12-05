// Description
//   Philippe is standing on it.
//
// Dependencies:
//  'htmlparser': '1.7.6'
//  'soupselect': '0.2.0'
//
// Configuration:
//   None
//
// Commands:
//   hubot achewood - A random Achewood comic
//   hubot achewood latest - The most recent Achewood comic
//   hubot achewood <date> - Achewood comic from <date> - mm/dd/yyyy format
//   hubot achewood <keyword> - Achewood comic for keyword
//   hubot saddest thing - The saddest thing, according to Lie Bot
//
// Author:
//   1000hz
//   Later hacked apart and redone in es6 by monksp


import htmlparser from 'htmlparser2';
import select from 'cheerio-select';
import requisition from 'requisition';

const setupRobot = robot => {
  const ohnorobot = async (term) => {
    const url = !term
      ? 'http://www.ohnorobot.com/random.php?comic=636'
      : `http://www.ohnorobot.com/index.php?comic=636&lucky=1&s=${term}`;

    const response = await requisition(url);
    return response.response.redirects[0];
  };

  const extractComic = async url => {
    const response = await requisition(url);
    const body = await response.text();

    const handler = new htmlparser.DefaultHandler();
    const parser = new htmlparser.Parser(handler);
    parser.parseComplete(body);

    const img = select('img.comic', handler.dom);
    const comic = img[0].attribs;

    return {
      image: `http://achewood.com${comic.src}#.png`,
      title: comic.title,
    };
  };

  const lookupAchewood = async (requested) => {
    let response;
    if (!requested) {
      const url = await ohnorobot();
      // response.then(url => extractComic(url));
      response = await extractComic(url);
    } else if (requested === 'latest') {
      response = await extractComic('http://achewood.com');
    } else if (requested.match(/\d{2}.?\d{2}.?\d{4}/)) {
      const date = requested.replace(/\D/g, '');
      const url = `http://achewood.com/index.php?date=${date}`;
      response = await extractComic(url);
    } else {
      const url = await ohnorobot(requested);
      // response.then(url => extractComic(url));
      response = await extractComic(url);
    }
    return response;
  };

  const emitComic = (res, image, title) => {
    res.send(image);
    res.send(title);
  };

  const dateRegex = /achewood\s?((?:0[1-9]|1[0-2]).?(?:0[1-9]|[1-2][0-9]|3[0-1]).?(?:20\d{2})$|.*)?/i;
  robot.respond(dateRegex, res => {
    const requested = res.match[1];
    lookupAchewood(requested).then(comic => emitComic(res, comic.image, comic.title));
  });

  const saddestList = ['06022003', '11052001', '09052006', '07302007', '12102001'];
  robot.respond(/.*saddest thing\?*/i, res => {
    const saddest = res.random(saddestList);
    lookupAchewood(saddest).then(comic => emitComic(res, comic.image, comic.title));
  });
};

module.exports = setupRobot;
