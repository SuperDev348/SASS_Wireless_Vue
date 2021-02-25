import deviceAPI from '../../services/api/device'

const module = {
  namespaced: true,
  state: {
    data: [],
    error: null,
    loadingDevices: false
  },

  actions: {
    async getDevices({ commit }, routerId = null) {
      commit('SET_LOADING_DEVICES', true)

      try {
        const response = await deviceAPI.getDevices(routerId)

        commit('SET_DATA', response.data)
      } catch (error) {
        console.log(error)
      }

      commit('SET_LOADING_DEVICES', false)
    }
  },

  mutations: {
    SET_DATA(state, users) {
      state.data = users
    },
    SET_ERROR(state, error) {
      state.error = error.error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_LOADING_DEVICES(state, loading) { state.loadingDevices = loading }
  },

  getters: {
  }
}

export default module