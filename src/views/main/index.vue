<template>
  <div id="main">
    <!--<h1>任务管理器</h1>-->
    <div class="nav">
      <span class="nav-item" v-for="route in routes">
        <router-link :to="{name:route.name}" class="nav-link" active-class="active">
          {{ route.title }}
        </router-link>
      </span>
    </div>
    <div class="content">
      <!--<keep-alive>-->
      <router-view></router-view>
      <!--</keep-alive>-->
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        routes: [{ name: 'workflows', title: '工作流' }, { name: 'executorGroups', title: '执行组' },]
      }
    },
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

  .nav {
    width: 100%;
    background: lightgrey;
    display: flex;
    .nav-item {
      padding: 5px;
      .nav-link {
        font-size: 20px;
        text-decoration: none;
        color: gray;
        &.active {
          color: black;
          cursor: not-allowed;
        }
      }
    }
  }

</style>
