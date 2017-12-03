<template>
  <div id="main">
    <h1>任务管理器</h1>
    <div class="content">
      <!--<keep-alive>-->
        <router-view></router-view>
      <!--</keep-alive>-->
    </div>
  </div>
</template>
<script>
  export default {
    mounted() {
//      this.$store.dispatch('connect')

//      this.$store.dispatch('getWorkFlows')
//      this.$store.dispatch('getServers')
//      this.$store.dispatch('getScripts')
    }
  }
</script>
<style lang="less">
  #main {
    /*padding-bottom: 20px;*/
    height: 100%;
  }

  .content {
    max-width: 1280px;
    margin: 0 auto;
  }
</style>
