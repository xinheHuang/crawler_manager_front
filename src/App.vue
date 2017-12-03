<template>
  <div id="app">
    <router-view class="main"></router-view>
  </div>
</template>

<script>
  import EventBus from './eventBus'
  import * as types from './store/mutation-types'
  export default {
    mounted() {
      EventBus.$on('errorDialog', ({title = '错误', text = '', callback}) => {
        this.$swal(
          {
            title,
            text,
            icon: 'error',
          }
        )
          .then(() => {
            if (callback)
              callback()
          })
      })

      EventBus.$on('index', () => {
        if (this.$route.name == 'index') {
          return
        }
        this.$router.push({
                            path: '/login',
                            query: {redirect: this.$route.path}
                          })
      })

    }
  }
</script>

<style scoped>
  .main {
    /*max-width: 1280px;*/
    margin: 0 auto;
    text-align: center;;
  }
</style>

