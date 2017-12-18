<template>
  <b-container id="login">
    <b-card title="爬虫管理系统"
            style="min-width: 350px;">
      <b-form @keyup.enter="login">
        <b-form-group id="exampleInputGroup1">
          <b-form-input id="exampleInput1"
                        type="text"
                        v-model="form.username"
                        required
                        placeholder="用户名">
          </b-form-input>
        </b-form-group>
        <b-form-group id="exampleInputGroup2">
          <b-form-input id="exampleInput2"
                        type="password"
                        v-model="form.password"
                        required
                        placeholder="密码">
          </b-form-input>
        </b-form-group>
        <b-button @click="login()" variant="primary" :disabled="isLogin">登录{{isLogin ? '中...' : ''}}</b-button>
      </b-form>
    </b-card>
  </b-container>
</template>
<script>
  import EventBus from '../../eventBus'
  import qs from 'qs'

  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
        },
        isLogin: false,
      }
    },
    methods: {
      async login() {
        const { username, password } = this.form
        if (!username || !password) {
          EventBus.$emit('errorDialog', {
            text: '用户名和密码不能为空'
          })
          return
        }
        this.isLogin = true
        try {
          await this.$store.dispatch('login', qs.stringify({ username, password }))
          console.log('redirect',this.$route.query.redirect)
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
    display: flex;
    align-items: center;
    justify-content: center;
    .b-form-group{
      margin: 30px 0;
    }
  }
</style>
