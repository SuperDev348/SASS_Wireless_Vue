import Vue from 'vue'
import Vuex from 'vuex'

// Global vuex
import AppModule from './app'
import auth from './auth'
import customers from './customers'
import users from './users'
import devices from './devices'
import cities from './cities'
import routers from './routers'
import bytesUsage from './bytes-usage'

Vue.use(Vuex)

/**
 * Main Vuex Store
 */
const store = new Vuex.Store({
  modules: {
    app: AppModule,
    auth,
    users,
    customers,
    cities,
    devices,
    routers,
    bytesUsage
  }
})

export default store
