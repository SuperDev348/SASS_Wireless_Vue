import cityAPI from '@/services/api/city'

const module = {
  namespaced: true,
  state: {
    data: []
  },

  actions: {
    async getCities({ commit, dispatch }, state) {
      try {
        const response = await cityAPI.getCities(state)

        commit('SET_DATA', response.data)
      } catch (err) {
        console.log(err)
      }
    }
  },

  mutations: {
    SET_DATA(state, cities) {
      state.data = cities
    }
  }
}

export default module