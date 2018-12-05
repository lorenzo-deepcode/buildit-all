export default class Slack {
  constructor(config) {
    this.config = config || {
      authorizationUrl: 'https://slack.com/oauth/authorize',
      oauthAccessUrl: 'https://slack.com/api/oauth.access',
      client_id: '3360794059.221548354467',
      client_secret: '2942f6d254a6321cbf469ee9e69a8bf3',
      scope: 'identity.basic',
      redirect_uri: 'https://d3u9qfdpbcxqst.cloudfront.net/confirm.html',
      team_id: 'T03ALPC1R',
      access_token: window.localStorage.getItem('totem.accessToken') || ''
    };
  }

  authorize() {
    const url = encodeURI(`${this.config.authorizationUrl}?client_id=${this.config.client_id}&scope=${this.config.scope}&redirect_uri=${this.config.redirect_uri}&team=${this.config.team_id}`);
    const ref = cordova.InAppBrowser.open(url, '_system', 'location=no');
  }

  generateFormBody(data) {
    const formBody = [];
    for (let property in data) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(data[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    return formBody.join('&');
  }

  getAccessToken(authCode) {
    const url = 'https://slack.com/api/oauth.access';
    const details = {
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      code: authCode,
      redirect_uri: this.config.redirect_uri
    };
    const data = {
      method: 'POST',
      body: this.generateFormBody(details),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;'
      }
    };

    cordovaFetch(url, data)
      .then(response => {
        if (response.statusText) {
          return JSON.parse(response.statusText);
        }
      })
      .then(res => {
        if (!res.ok) {
          console.log(res.error);
        }
        if (res.access_token) {
          this.config.access_token = res.access_token;
          window.localStorage.setItem('totem.accessToken', res.access_token);
          window.localStorage.setItem('totem.user', JSON.stringify(res.user));
          document.getElementById('slack-container').style.display = 'none';
          document.getElementById('username').innerHTML = `${res.user.name} (${res.user.id})`;
          document.getElementById('slack-logged-in').style.display = 'block';
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateStatus(message, emoji) {
    const url = 'https://slack.com/api/users.profile.set';
    const data = {
      method: 'POST',
      body: `token=${this.config.access_token}&profile=%7B%22status_text%22%3A%22${message}%22%2C%22status_emoji%22%3A%22%3A${emoji}%3A%22%7D`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;'
      }
    };
    cordovaFetch(url, data)
      .then(response => {
        if (response.statusText) {
          return JSON.parse(response.statusText);
        }
      })
      .then(res => {
        if (!res.ok) {
          console.log(res.error);
        }
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
}