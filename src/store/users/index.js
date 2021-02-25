import userAPI from '../../services/api/user'
import router from '../../router'

const module = {
  namespaced: true,
  state: {
    data: [],
    user: null,
    error: null,
    loadingUsersTable: false,
    button_loading: false
  },

  actions: {
    async getUsers({ commit }, role) {
      commit('TABLE_LOAD', true)
      commit('SET_DATA', [])
      try {
        let response

        if (role === 'kore')
          response = await userAPI.getKoreUsers()
        else if (role === 'customers')
          response = await userAPI.getCompanyUsers()

        commit('SET_DATA', response.data)
      } catch (error) {
        console.log(error)
      }

      commit('TABLE_LOAD', false)
    },
    async openEditUser({ commit }, id) {
      try {
        const response = await userAPI.openEditUser(id)

        commit('SET_USER', response.data.user)
        commit('cities/SET_DATA', response.data.cities, { root: true })
      } catch (error) {
        console.log(error)
      }
    },
    async addUser({ commit, rootState, dispatch }, data) {
      commit('BUTTON_LOAD')

      try {
        const response = await userAPI.addUser(data)

        dispatch('app/showSuccess', response.data, { root: true })
      } catch (error) {
        if (error.response.status === 422) {
          const errors = Object.values(error.response.data.error).flat()

          commit('SET_ERROR', {
            'error': errors[0]
          })
        }

        throw new Error(error)
      } finally {
        commit('BUTTON_CLEAR')
      }
    },
    async updateUserAccount({ commit, rootState, dispatch }, data) {
      commit('BUTTON_LOAD')

      try {
        const response = await userAPI.updateUserAccount(data)

        dispatch('app/showSuccess', response.data, { root: true })
      } catch (error) {
        console.log(error)

        if (error.response.status === 422) {
          const errors = Object.values(error.response.data.error).flat()

          commit('SET_ERROR', {
            'error': errors[0]
          })
        }
      } finally {
        commit('BUTTON_CLEAR')
      }
    }
  },

  mutations: {
    SET_DATA(state, users) {
      state.data = users
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_ERROR(state, error) {
      state.error = error.error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    TABLE_LOAD(state, loading) { state.loadingUsersTable = loading },
    BUTTON_LOAD(state) {
      state.button_loading = true
    },
    BUTTON_CLEAR(state) {
      state.button_loading = false
    }
  },

  getters: {
  }
}

export default module