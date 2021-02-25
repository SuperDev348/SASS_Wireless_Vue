import routerAPI from '../../services/api/router'

const module = {
  namespaced: true,
  state: {
    data: [],
    error: null,
    loadingRouters: false
  },

  actions: {
    async getRouters({ commit }) {
      commit('TABLE_LOAD', true)
      commit('SET_DATA', [])
      try {
        const response = await routerAPI.getRouters()

        commit('SET_DATA', response.data.data)
      } catch (error) {
        console.log(error)
      }

      commit('TABLE_LOAD', false)
    },

    async assignCompany({ commit, dispatch }, payload) {
      try {
        const response = await routerAPI.assignCompany(payload)

        dispatch('app/showSuccess', response.data.message, { root: true })
      } catch (error) {
        dispatch('app/showError', error.response.data.message, { root: true })

        throw new Error(err)
      }
    },

    async assignManyToCompany({ commit, dispatch }, payload) {
      try {
        const response = await routerAPI.assignManyToCompany(payload)
      } catch (error) {
        throw new Error(err)
      }
    },

    async updateRouter({ commit, dispatch }, payload) {
      try {
        const response = await routerAPI.updateRouter(payload)

        dispatch('app/showSuccess', response.data.message, { root: true })
      } catch (error) {
        dispatch('app/showError', error.response.data.message, { root: true })

        throw new Error(err)
      }
    }
  },

  mutations: {
    SET_DATA(state, routers) {
      state.data = routers
    },
    SET_ERROR(state, error) {
      state.error = error.error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    TABLE_LOAD(state, loading) { state.loadingRouters = loading }
  },

  getters: {
  }
}

export default module