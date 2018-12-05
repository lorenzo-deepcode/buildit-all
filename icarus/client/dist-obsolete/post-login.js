var router = new VueRouter({
    mode: 'history',
    routes: []
});

var postLogin = new Vue({
  router,
  el: '#post-login',
  data: {
    mustLogIn: false,
    hasAccessToken: false
  },
  mounted: function() {
    var slackAuthorisationCode = this.$route.query.code;
    console.log("Slack authorisation code obtained: " + slackAuthorisationCode);

    this.$nextTick(function() {
      redeemSlackAuthCode(slackAuthorisationCode);
    });
  },
  methods: {
    processToken: function(userToken) {
      setIcarusUserToken(userToken);
      window.location.href="index.html";
    },
  }
});

function redeemSlackAuthCode(slackAuthorisationCode) {
  var initReturnPageUri = siteBasePath + '/post-login.html';

  axios.post(lambdaPath + '/slack-oauth-complete', {
    code: slackAuthorisationCode,
    returnUri: initReturnPageUri,
  }).then(function(response) {
        console.log(response);
        postLogin.processToken(response.data);
    })
    .catch(function(err) {
        console.log(err);
    });
}
