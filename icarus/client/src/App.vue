<template>
  <div id="app" class="container">
      <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'app',
  props: [ 'siteBasePath', 'lambdaPath' ],
  mounted: function() {
      console.log('Lambda base URI: ' + this.lambdaPath)
      console.log('Site base URI: ' + this.siteBasePath)
  },  
}
</script>

<style>

</style>
