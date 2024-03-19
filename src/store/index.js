import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:80'
Vue.prototype.$http = axios

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
