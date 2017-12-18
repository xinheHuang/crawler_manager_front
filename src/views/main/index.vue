<template>
  <div id="main">
    <b-navbar toggleable="md" type="dark" variant="dark">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">爬虫管理系统</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item v-for="route in routes"><b-link :to="{name:route.name}">{{route.title}}</b-link></b-nav-item>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
    <b-container>
      <!--<keep-alive>-->
      <router-view style=" padding: 20px 0;"></router-view>
      <!--</keep-alive>-->
    </b-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        routes: [{ name: 'workflows', title: '工作流' }, { name: 'executorGroups', title: '执行组' },],
        timer: null,
        refreshInterval: 1000,
      }
    },
    methods: {
      async refreshWorkFlows() {
        console.log('get workflow')
        await this.$store.dispatch('getWorkFlows')
        this.timer = setTimeout(() => {
          this.refreshWorkFlows()
        }, this.refreshInterval)
      },
    },
    mounted() {
      this.$store.dispatch('connect')
      this.refreshWorkFlows()
    },
    destroyed() {
      this.$store.dispatch('close')
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
</script>
<style lang="less">

</style>
