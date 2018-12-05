<template>
    <div class="jumbotron">
        <h3><span class='glyphicon-left glyphicon glyphicon-refresh spinning'></span>One moment please...</h3>
        <p>...linking your GitHub account to your Icarus identity.</p>
    </div>  
</template>

<script>
// import axios from 'axios'
import { integrationOauthComplete } from '../common.js'

export default {
  props: [ 'siteBasePath', 'lambdaPath' ],
  mounted: function() {
    const gotoMain = () => this.$router.push('/')
    
    this.$nextTick(function() {
        const githubAuthorisationCode = this.$route.query.code;
        console.log("GitHub authorisation code obtained: " + githubAuthorisationCode);
        const oauthInitReturnUri = this.siteBasePath + '/github-post-login'; // Must match the return uri used when initiating the OAuth journey; for verification only
        const oauthCompleteLambdaUri = this.lambdaPath + '/github-oauth-complete'

        integrationOauthComplete(oauthCompleteLambdaUri, githubAuthorisationCode, oauthInitReturnUri)
          .then( (updatedUserToken) => {
            if( updatedUserToken) {
              this.userToken = updatedUserToken
            }
            gotoMain()
          })
          .catch( err => gotoMain() )
      
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
