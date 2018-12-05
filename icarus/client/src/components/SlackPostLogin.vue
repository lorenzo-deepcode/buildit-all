<template>
    <div class="jumbotron">
        <h3><span class='glyphicon-left glyphicon glyphicon-refresh spinning'></span>One moment please...</h3>
        <p>...creating a new Icarus identity or linking to an existing one.</p>
    </div>  
</template>

<script>

import axios from 'axios'
import { setUserToken } from '../common.js'

export default {
  props: [ 'siteBasePath', 'lambdaPath' ],
  mounted: function() {
    const slackAuthorisationCode = this.$route.query.code;
    console.log("Slack authorisation code obtained: " + slackAuthorisationCode);

    const gotoMain = () => this.$router.push('/')
    

    this.$nextTick(function() {
      // Redeem auth code
      const initReturnPageUri = this.siteBasePath + '/post-login'; // Must match the returnPageUri of the OAuth init

      axios.post(this.lambdaPath + '/slack-oauth-complete', {
        code: slackAuthorisationCode,
        returnUri: initReturnPageUri,
      }).then(function(response) {
          console.log(response);
          const userToken = response.data
          setUserToken(userToken)

          gotoMain()
      })
      .catch(function(err) {
          console.log(err)
          gotoMain()
      })
    })
  },

}

</script>

<style scoped>
.jumbotron {
  text-align: center;
}
.glyphicon.spinning {
  animation: spin 1s infinite linear;
  -webkit-animation: spin2 1s infinite linear;
}

@keyframes spin {
  from { transform: scale(1) rotate(0deg);}
  to { transform: scale(1) rotate(360deg);}
}

@-webkit-keyframes spin2 {
  from { -webkit-transform: rotate(0deg);}
  to { -webkit-transform: rotate(360deg);}
}

.glyphicon-left {
  margin-right: 7px;
}
</style>
