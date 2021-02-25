import Vue from 'vue'
import router from '../../router'
import authAPI from '@/services/api/auth'

const module = {
  namespaced: true,
  state: {
    isAppReady: false,
    token: null,
    user: {
      roleId: null,
      email: null,
      username: null,
      companyId: null,
      companyLogo: ''
    },
    roles: [
      {
        'id': 100,
        'key': 'super_admin',
        'name': 'Super Admin'
      }, {
        'id': 1,
        'key': 'kore_admin',
        'name': 'Kore Admin'
      }, {
        'id': 2,
        'key': 'kore_manager',
        'name': 'Kore Manager'
      }, {
        'id': 3,
        'key': 'kore_viewer',
        'name': 'Kore Viewer'
      }, {
        'id': 4,
        'key': 'customer_admin',
        'name': 'Customer Administrator'
      }, {
        'id': 5,
        'key': 'customer_manager',
        'name': 'Customer Manager'
      }, {
        'id': 6,
        'key': 'customer_operator',
        'name': 'Customer Operator'
      }
    ],

    error: null,
    loading: true,
    button_loading: false
  },

  actions: {
    async signIn({
      commit
    }, {
      email, password
    }) {
      commit('BUTTON_LOAD')
      commit('CLEAR_ERROR')

      try {
        const response = await authAPI.signIn(email, password)
        
        commit('SET_TOKEN', response.data.token)
        
        localStorage.setItem('token', response.data.token)

        try {
          const checkResponse = await authAPI.check()

          commit('SET_AUTH_DATA', checkResponse.data.data)

          if ([1, 2, 3].includes(checkResponse.data.data.roleId)) {
            router.push({
              name: 'kore-users-list'
            })
          } else if ([4, 5, 6].includes(checkResponse.data.data.roleId)) {
            router.push({
              name: 'users-list'
            })
          }
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        if (error.response.status === 404) {
          commit('SET_ERROR', {
            'error': 'User not found.'
          })
        } else if (error.response.status === 401) {
          commit('SET_ERROR', {
            'error': 'Email and password incorrect.'
          })
        }
      }

      commit('BUTTON_CLEAR')
    },

    /**
     *
     * Logout
     *
     * @param {*} param0
     */
    async signOut({ commit }) {
      const response = await authAPI.signOut()

      if (response.status === 200) {
        commit('SET_LOGOUT_AUTH')
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        router.push({
          name: 'auth-signin'
        })
      }
    },

    async updatePassword({
      commit, dispatch
    }, {
      currentPassword, newPassword
    }) {
      commit('BUTTON_LOAD')
      
      try {
        const response = await authAPI.updatePassword(currentPassword, newPassword)

        dispatch('app/showSuccess', response.data.message, { root: true })
      } catch (error) {
        if (error.response.status === 400) {
          commit('SET_ERROR', {
            'error': error.response.data.error
          })
        } else if (error.response.status === 422) {
          const errors = Object.values(error.response.data.error).flat()

          commit('SET_ERROR', {
            'error': errors[0]
          })
        }
      }
      
      commit('BUTTON_CLEAR')
    },
    
    async requestForgotPassword({
      commit
    }, email) {
      commit('BUTTON_LOAD')

      try {
        await authAPI.requestForgotPassword(email)
      } catch (error) {
        if (error.response.status === 404) {
          commit('SET_ERROR', {
            'error': error.response.data
          })
        }
      }
      
      commit('BUTTON_CLEAR')
    }
  },

  mutations: {
    BOOTSTRAP(state, { user, token }) {
      if (user && token) {
        state.user = user
        state.token = token
      }

      state.isAppReady = true
    },

    SET_ERROR(state, error) {
      state.error = error.error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_AUTH_DATA(state, data) {
      state.user = data
    },
    SET_LOGOUT_AUTH(state) {
      state.token = null
      state.user.role = null
      state.user.email = null
      state.user.username = null
      state.user.companyId = null
    },
    BUTTON_LOAD(state) {
      state.button_loading = true
    },

    BUTTON_CLEAR(state) {
      state.button_loading = false
    },

    SET_LOADING_TIME_ZONE(state, loading) { state.loadingTimezone = loading },
    SET_UPDATING_TIME_ZONE(state, loading) { state.updatingTimezone = loading },

    SET_TIMEZONES(state, timezones) { state.timeZoneNames = timezones},
    SET_LOGO_FILE(state, logo) { state.user.companyLogo = logo },
    SET_AUTH_COMPANY(state, company) { state.user.company = company }
  },

  getters: {
    roleName: (state) => (role_id) => {
      return state.roles.find((role) => role.id === role_id).name
    },
    canCreateKoreUser: (state) => state.user.roleId === 1,
    canCreateCompanies: (state) => [1, 2, 4].includes(state.user.roleId),
    canViewCompanies: (state) => [1, 2, 3].includes(state.user.roleId),
    canImportDevices: (state) => ['kore_admin', 'kore_manager'].includes(state.user.roleId),
    canCreateCustomerUser: (state) => state.user.roleId === 4
  }
}

export default module
