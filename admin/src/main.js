import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/index.css'
import http from './router/http.js'
import UUID from 'vue-uuid'

Vue.config.productionTip = false

Vue.prototype._http = http

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(UUID)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
