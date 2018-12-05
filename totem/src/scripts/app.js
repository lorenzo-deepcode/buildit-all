import "babel-polyfill";
import firebase from 'firebase';
import Microbit from './microbit';
import Slack from './slack';
import Rx from 'rxjs';

export default class App {
  constructor() {
    this.CONNECT_TIMEOUT = 5000;
    this.totemPosition = 1;
    this.oldTotemPosition = 1;
    this.userId = '';
    this.user = null;
    this.updateSlackStatus = false;
    this.slackClient = new Slack();
    this.microbit = new Microbit({
      ACCELEROMETER_SERVICE: 'e95d0753-251d-470a-a062-fa1922dfa9a8',
      ACCELEROMETER_DATA: 'e95dca4b-251d-470a-a062-fa1922dfa9a8',
      ACCELEROMETER_PERIOD: 'e95dfb24-251d-470a-a062-fa1922dfa9a8',
      DEVICE_INFO_SERVICE: '0000180a-0000-1000-8000-00805f9b34fb',
      DEVICE_MODEL: '00002a24-0000-1000-8000-00805f9b34fb',
      SERIAL_NUMBER: '00002a25-0000-1000-8000-00805f9b34fb',
      FIRMWARE_REVISION: '00002a26-0000-1000-8000-00805f9b34fb',
      BLE_NOTIFICATION_UUID: '00002902-0000-1000-8000-00805f9b34fb'
    });

    this.firebaseConfig = {
      apiKey: 'API_KEY',
      authDomain: 'AUTH_DOMAIN',
      databaseURL: 'DATABASE_URL',
      projectId: 'PROJECT_ID',
      storageBucket: 'STORAGE_BUCKET',
      messagingSenderId: 'MESSAGING_SENDER_ID'
    };
  }

  initialize() {
    document.addEventListener('deviceready', () => {
      const user = JSON.parse(window.localStorage.getItem('totem.user'));

      document.getElementById('slack-container').style.display = 'block';
      document.getElementById('slack-logged-in').style.display = 'none';

      if (window.localStorage.getItem('totem.accessToken')) {
        document.getElementById('slack-container').style.display = 'none';
      }

      if (user) {
        this.userId = user.id;
        this.user = user;
        document.getElementById('username').innerHTML = `${this.user.name} (${this.user.id})`;
        document.getElementById('slack-logged-in').style.display = 'block';
      }


      evothings.scriptsLoaded(this.onDeviceReady.bind(this));
    }, false);
    this.initializeFirebase();
  }

  initializeFirebase() {
    firebase.initializeApp(this.firebaseConfig);
  }

  onDeviceReady() {
    document
      .getElementById('connect-button')
      .addEventListener('click', () => {
        this.onStartButton();
      });

    document
      .getElementById('slack-button')
      .addEventListener('click', () => {
        this.onSlackButton();
      });
    this.showInfo('Activate the Microbit and tap Start.');
  }

  onSlackButton() {
    this.slackClient.authorize();
  }

  showInfo(info) {
    document.getElementById('status').innerHTML = info;
    return this;
  }

  createNewStatus(status, timestamp, id = '') {
    let slackUser = null;

    if (!id) {
      slackUser = JSON.parse(window.localStorage.getItem('totem.user'));
      id = slackUser.id;
    }

    firebase.database().ref('user-status/' + id + "/").push({
      status: status,
      timestamp: timestamp
    });
  }

  onStartButton() {
    this
      .onStopButton()
      .startScan()
      .showInfo('Scanning...')
      .startConnectTimer();
  }

  onStopButton() {
    this.stopConnectTimer();
    this.microbit.resetScan();
    this.showInfo('Stopped.');
    return this;
  }

  startConnectTimer() {
    this.connectTimer = setTimeout(() => {
        this.showInfo('Scanning...<br />Please start the Microbit.');
      },
      this.CONNECT_TIMEOUT);
    return this;
  }

  stopConnectTimer() {
    clearTimeout(this.connectTimer);
  }

  startScan() {
    this
      .microbit
      .startScan()
      .then(device => {
        this.showInfo(`Device found: ${device.name}. Connecting...`);
        return this.microbit.connectToDevice(device);
      })
      .then(device => {
        this.showInfo('Connected - reading Microbit services...');
        this.stopConnectTimer();
        this.resetTotemPosition();
        return this.microbit.readServices(device);
      })
      .then(device => {
        this.showInfo('Starting notifications...');
        return this.microbit.startNotifications(device);
      })
      .then(sourceObservable => {
        this.showInfo('Setup complete. Receiving data...');

        const subject = new Rx.Subject();
        const multicasted = sourceObservable().multicast(subject);

        multicasted
          .delay(500)
          .catch(e => {
            console.log(e);
            this.showInfo(`Error: ${e}.`);
          })
          .subscribe({
            next: (data) => {
              this.handleAccelerometerValues(data);
            }
          });

        multicasted
          .throttleTime(5000)
          .catch(e => console.log(e))
          .subscribe({
            next: () => {
              if ((this.oldTotemPosition !== this.totemPosition) || this.updateSlackStatus) {
                this.oldTotemPosition = this.totemPosition;
                this.updateSlackStatus = false;
                this.createNewStatus(this.totemPosition - 1, new Date().getTime(), this.userId);

                if (this.user.id) {
                  this.slackClient.updateStatus(this.message, this.emoji, this.color, this.image);
                }
              }
            }
          });

        multicasted.connect();
      })
      .catch(err => {
        this.showInfo(`Error: ${err}.`);
      });
    return this;
  }

  resetTotemPosition() {
    this.totemPosition = 1;
    this.oldTotemPosition = 1;
  }

  updateImage() {
    document.body.style.background = this.color;
    document.getElementById('change-status').innerHTML = `<br><img src="${this.image}"><p class="message">${this.message}</p>`;
  }

  handleAccelerometerValues(data) {
    // TODO - remove status update from parseAccelerometerValues function
    this.parseAccelerometerValues(new Uint8Array(data));
    if (this.oldTotemPosition !== this.totemPosition) {
      this.oldTotemPosition = this.totemPosition;
      this.updateSlackStatus = true;
      this.updateImage();
    }
  }

  /**
   * Calculate accelerometer values from raw data for Microbit.
   * @param data - an Uint8Array.
   * @return Object with fields: x, y, z.
   */
  parseAccelerometerValues(data) {
    // We want to scale the values to +/- 1.
    // Documentation says: "Values are in the range +/-1000 milli-newtons, little-endian."
    // Actual maximum values is measured to be 2048.
    const rawX = evothings.util.littleEndianToInt16(data, 0);
    const rawY = evothings.util.littleEndianToInt16(data, 2);
    const rawZ = evothings.util.littleEndianToInt16(data, 4);

    // TODO - check why the totemPosition is confused when dropping the microbit
    if (rawZ > 850 && rawZ < 1200) {
      this.totemPosition = 1;
      this.message = 'Stopped';
      this.emoji = 'zzz';
      this.color = '#dddfd4';
      this.image = 'res/slack-totem-icons/totem-stop-emoji.png';
    }

    if (rawZ < -850 && rawZ > -1200) {
      this.totemPosition = 2;
      this.message = 'Paused';
      this.emoji = 'totem-pause';
      this.color = '#dddfd4';
      this.image = 'res/slack-totem-icons/totem-pause-emoji.png';
    }

    if (rawX > 850 && rawX < 1200) {
      this.totemPosition = 3;
      this.message = 'Deep<br />cognitive<br />work';
      this.emoji = 'totem-deep-cog';
      this.color = '#33cccc';
      this.image = 'res/slack-totem-icons/totem-thought-emoji.png';
    }

    if (rawX < -850 && rawX > -1200) {
      this.totemPosition = 4;
      this.message = 'Tangible<br />work';
      this.emoji = 'totem-deep-work';
      this.color = '#ff6666';
      this.image = 'res/slack-totem-icons/totem-deep-emoji.png';
    }

    if (rawY > 850 && rawY < 1200) {
      this.totemPosition = 5;
      this.message = 'Get stuff done';
      this.emoji = 'totem-stuff';
      this.color = '#6666ff';
      this.image = 'res/slack-totem-icons/totem-work-emoji.png';
    }

    if (rawY < -850 && rawY > -1200) {
      this.totemPosition = 6;
      this.message = 'Work with others';
      this.emoji = 'totem-collaborate';
      this.color = '#ffcc00';
      this.image = 'res/slack-totem-icons/totem-talk-emoji.png';
    }
  }
}

const app = new App();
app.initialize();
window.totemApp = app;
