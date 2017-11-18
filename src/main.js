import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import HttpUtil from './httpUtil'
import Swal from 'sweetalert'

Vue.prototype.$swal = Swal;
Vue.prototype.$http = HttpUtil

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
