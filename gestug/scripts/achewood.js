'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _htmlparser = require('htmlparser2');

var _htmlparser2 = _interopRequireDefault(_htmlparser);

var _cheerioSelect = require('cheerio-select');

var _cheerioSelect2 = _interopRequireDefault(_cheerioSelect);

var _requisition = require('requisition');

var _requisition2 = _interopRequireDefault(_requisition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setupRobot = function setupRobot(robot) {
  var ohnorobot = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(term) {
      var url, response;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = !term ? 'http://www.ohnorobot.com/random.php?comic=636' : 'http://www.ohnorobot.com/index.php?comic=636&lucky=1&s=' + term;
              _context.next = 3;
              return (0, _requisition2.default)(url);

            case 3:
              response = _context.sent;
              return _context.abrupt('return', response.response.redirects[0]);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function ohnorobot(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var extractComic = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(url) {
      var response, body, handler, parser, img, comic;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _requisition2.default)(url);

            case 2:
              response = _context2.sent;
              _context2.next = 5;
              return response.text();

            case 5:
              body = _context2.sent;
              handler = new _htmlparser2.default.DefaultHandler();
              parser = new _htmlparser2.default.Parser(handler);

              parser.parseComplete(body);

              img = (0, _cheerioSelect2.default)('img.comic', handler.dom);
              comic = img[0].attribs;
              return _context2.abrupt('return', {
                image: 'http://achewood.com' + comic.src + '#.png',
                title: comic.title
              });

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function extractComic(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var lookupAchewood = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(requested) {
      var response, url, date, _url, _url2;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              response = void 0;

              if (requested) {
                _context3.next = 10;
                break;
              }

              _context3.next = 4;
              return ohnorobot();

            case 4:
              url = _context3.sent;
              _context3.next = 7;
              return extractComic(url);

            case 7:
              response = _context3.sent;
              _context3.next = 30;
              break;

            case 10:
              if (!(requested === 'latest')) {
                _context3.next = 16;
                break;
              }

              _context3.next = 13;
              return extractComic('http://achewood.com');

            case 13:
              response = _context3.sent;
              _context3.next = 30;
              break;

            case 16:
              if (!requested.match(/\d{2}.?\d{2}.?\d{4}/)) {
                _context3.next = 24;
                break;
              }

              date = requested.replace(/\D/g, '');
              _url = 'http://achewood.com/index.php?date=' + date;
              _context3.next = 21;
              return extractComic(_url);

            case 21:
              response = _context3.sent;
              _context3.next = 30;
              break;

            case 24:
              _context3.next = 26;
              return ohnorobot(requested);

            case 26:
              _url2 = _context3.sent;
              _context3.next = 29;
              return extractComic(_url2);

            case 29:
              response = _context3.sent;

            case 30:
              return _context3.abrupt('return', response);

            case 31:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function lookupAchewood(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  var emitComic = function emitComic(res, image, title) {
    res.send(image);
    res.send(title);
  };

  var dateRegex = /achewood\s?((?:0[1-9]|1[0-2]).?(?:0[1-9]|[1-2][0-9]|3[0-1]).?(?:20\d{2})$|.*)?/i;
  robot.respond(dateRegex, function (res) {
    var requested = res.match[1];
    lookupAchewood(requested).then(function (comic) {
      return emitComic(res, comic.image, comic.title);
    });
  });

  var saddestList = ['06022003', '11052001', '09052006', '07302007', '12102001'];
  robot.respond(/.*saddest thing\?*/i, function (res) {
    var saddest = res.random(saddestList);
    lookupAchewood(saddest).then(function (comic) {
      return emitComic(res, comic.image, comic.title);
    });
  });
}; // Description
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


module.exports = setupRobot;