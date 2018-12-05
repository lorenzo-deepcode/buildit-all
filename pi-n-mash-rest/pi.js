const http = require('http');

const updateMatrix = (matrix) => {
  const post_data = JSON.stringify({ matrix });

  var req = http.request({
    hostname: 'pi',
    port: 8080,
    path: '/matrix',
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
    }
  });
  req.write(post_data);
  req.end();
}

const sendMessage = (message) => {
  const post_data = JSON.stringify({
    message,
    speed: '0.05'
  });

  var req = http.request({
    hostname: 'pi',
    port: 8080,
    path: '/show',
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
    }
  });
  req.write(post_data);
  req.end();
};

let timer = null;
let countdownValue = 0;
const startCountdown = () => {
  countdownValue = 60;
  timer = setInterval(countdown, 1000);
  countdown();
}

const e = [0,0,0];
const w = [255,255,255];
const r = [255,0,0];
const g = [0,255,0];
let status = [r, r, r];

const emptyMatrix = [
  e, e, e, e, e, e, e, e,
  e, e, e, e, e, e, e, e,
  e, e, e, e, e, e, e, e,
  e, e, e, e, e, e, e, e,
  e, e, e, e, e, e, e, e,
  e, e, e, e, e, e, e, e,
  e, e, e, e, e, e, e, e,
  e, e, e, e, e, e, e, e,
];
const redMatrix = [
  r, w, w, w, w, w, w, r,
  w, r, w, w, w, w, r, w,
  w, w, r, w, w, r, w, w,
  w, w, w, r, r, w, w, w,
  w, w, w, r, w, w, w, w,
  w, w, r, w, w, r, w, w,
  w, r, w, w, w, w, r, w,
  r, w, w, w, w, w, w, r,
];

const countdown = () => {
  if (--countdownValue) {
    // Fill in the rows
    let matrix = [
      e, e, e, e, e, e, e, e,
      e, e, e, e, e, e, e, e,
      e, e, e, e, e, e, e, e,
      e, e, e, e, e, e, e, e,
      e, e, e, e, e, e, e, e,
      e, e, e, e, e, e, e, e,
      e, e, e, e, e, e, e, e,
      e, e, e, e, e, status[0], status[1], status[2],
    ];

    for (let i = 0; i < countdownValue; i++) {
      matrix[i] = w;
    }

    updateMatrix(matrix);
  } else {
    flashX();
    clearInterval(timer);
    status = [r, r, r];
  }
}

const flashX = () => {
  updateMatrix(redMatrix);
  setTimeout(() => {
    updateMatrix(emptyMatrix);
    setTimeout(() => {
      updateMatrix(redMatrix);
      setTimeout(() => {
        updateMatrix(emptyMatrix);
        setTimeout(() => {
          updateMatrix(redMatrix);
          setTimeout(() => {
            updateMatrix(emptyMatrix);
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  }, 250);
}

const cancel = () => {
  if (timer) {
    clearInterval(timer);
    status = [r, r, r];
    return true;
  }
  return false;
}

const updateStatus = (face, voice, finger) => {
  if (face !== null )
    status[0] = face ? g : r;
  if (voice !== null )
    status[1] = voice ? g : r;
  if (finger !== null )
    status[2] = finger ? g : r;
};

const showCheck = () => {
  cancel();
  let matrix = [
    e, e, g, e, e, e, e, e,
    e, g, e, e, e, e, e, e,
    g, e, e, e, e, e, e, e,
    e, g, e, e, e, e, e, e,
    e, e, g, e, e, e, e, e,
    e, e, e, g, e, e, e, e,
    e, e, e, e, g, e, e, e,
    e, e, e, e, e, g, e, e,
  ];
  updateMatrix(matrix);
}

const clearMatrix = () => {
  cancel();
  updateMatrix(emptyMatrix);
}

const fail = () => {
  cancel();
  flashX();
}

exports.sendMessage = sendMessage;
exports.startCountdown = startCountdown;
exports.fail = fail;
exports.updateStatus = updateStatus;
exports.showCheck = showCheck;
exports.clearMatrix = clearMatrix;
