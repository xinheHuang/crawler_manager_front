<template>
  <div id="login">
    <label>用户名</label>
    <input v-model="username"/>
    <label>密码</label>
    <input v-model="password"/>
    <button @click="login"
            :diabled="isLogin">登录{{isLogin ? '中' : ''}}
    </button>
  </div>
</template>
<script>
  import EventBus from "../../eventBus"
  import qs from 'qs'

  export default {
    data() {
      return {
        username: null,
        password: null,
        isLogin: false,
      }
    },
    methods: {
      async login() {
        const {username, password} = this
        if (!username || !password) {
          EventBus.$emit('errorDialog', {
            text: '用户名和密码不能为空'
          })
          return
        }
        this.isLogin = true
        try {
          await this.$store.dispatch('login', qs.stringify({username, password}))
          this.$router.push(this.$route.query.redirect || '/')
        }
        catch (e) {
          EventBus.$emit('errorDialog', {
            title: '登陆失败!',
            text: '请检查用户名或者密码'
          })
        }
        finally {
          this.isLogin = false
        }
      },
    }
  }
</script>
<style lang="less"
       scoped>
  #login {

  }
</style>
