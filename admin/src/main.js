import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/index.css'
import http from './router/http'
import ubuntu from './router/ubuntu'
import UUID from 'vue-uuid'
import echarts from 'echarts'

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.prototype._http = http
Vue.prototype._ubuntu = ubuntu

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(UUID)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
