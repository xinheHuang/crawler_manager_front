import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'

import App from './App.vue'
import router from './router'
import store from './store'
import HttpUtil from './utils/httpUtil'
import Swal from 'sweetalert'
import './styles/common.css'

Vue.prototype.$swal = Swal;
Vue.prototype.$http = HttpUtil

Vue.use(BootstrapVue);
Vue.component('icon', Icon)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
