import Vue from 'vue'
import App from './App.vue'
import './common/font.css'
import axios from 'axios'
import qs from 'qs'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.post['Content-Type'] = 'Application/Json'

Vue.use(Vuex)
Vue.use(ElementUI)

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.HOST = '/api'

Vue.config.productionTip = false
Vue.use(mavonEditor)

new Vue({
  render: h => h(App),
  comments: {
    App,
  },
  router,
  store,
}).$mount('#app')
