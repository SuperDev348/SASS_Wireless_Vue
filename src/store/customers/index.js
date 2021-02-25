import companyAPI from '../../services/api/company'
import router from '../../router'

const module = {
  namespaced: true,
  state: {
    button_loading: false,                    // loading status
    isTableLoading: false,

    error: null,
    
    data: [],                                 // companies
    companyAdmins: [],
    companies: [],
    company: null,

    uploadingLogo: false
  },

  actions: {
    async getCompanyAdmins({
      commit
    }) {
      commit('TABLE_LOAD')
      
      try {
        const response = await companyAPI.getCompanyAdmins()

        commit('SET_CUSTOMER_ADMINS', response.data.data)
      } catch (error) {
        console.log(error.response)
      }

      commit('TABLE_LOADED')
    },

    /*
      Get all companies
    */
    async getCompanies({
      commit
    }) {
      try {
        const response = await companyAPI.getCompanies()

        commit('SET_COMPANIES', response.data.data)
      } catch (error) {
        console.log(error.response)
      }
    },

    async getCompany({
      commit
    }, id) {
      try {
        const response = await companyAPI.getCompany(id)

        commit('SET_COMPANY', response.data.data)
      } catch (error) {
        throw new Error(err)
      }
    },

    async createCompany({
      commit
    }, payload) {
      try {
        const response = await companyAPI.createCompany(payload)

        return response
      } catch (err) {
        throw new Error(err)
      }
    },

    async uploadLogo({ commit, dispatch }, { formData }) {
      commit('SET_LOGO_UPLOADING', true)

      try {
        const response = await companyAPI.uploadLogo(formData)

        dispatch('app/showSuccess', response.data.message, { root: true })
        commit('auth/SET_AUTH_COMPANY', response.data.data, { root: true })
      } catch (error) {
        console.log(error.response)
      }

      commit('SET_LOGO_UPLOADING', false)
    },

    async updateCompany({ commit, dispatch }, payload) {
      try {
        const response = await companyAPI.updateCompany(payload)

        commit('auth/SET_AUTH_COMPANY', response.data.data, { root: true })

        dispatch('app/showSuccess', response.data.message, { root: true })
      } catch (error) {
        console.log(error)
      }
    },

    async createCustomerWithDevices({ commit }, payload) {
      try {
        const response = await companyAPI.createCustomerWithDevices(payload)

        return response
      } catch (err) {
        throw new Error(err)
      }
    },

    async updateCustomerWithDevices({ commit }, payload) {
      try {
        const response = await companyAPI.updateCustomerWithDevices(payload)

        return response
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  mutations: {
    SET_ERROR(state, error) {
      state.error = error.error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },

    // BUTTON load
    BUTTON_LOAD(state) {
      state.button_loading = true
    },

    BUTTON_CLEAR(state) {
      state.button_loading = false
    },

    TABLE_LOAD(state) {
      state.isTableLoading = true
    },

    TABLE_LOADED(state) {
      state.isTableLoading = false
    },

    SET_CUSTOMERS(state, customers) {
      state.data = customers
    },

    SET_COMPANIES(state, companies) {
      state.companies = companies
    },

    SET_COMPANY(state, company) {
      state.company = company
    },

    SET_CUSTOMER_ADMINS(state, companyAdmins) { state.companyAdmins = companyAdmins },

    SET_LOGO_UPLOADING(state, value) { state.uploadingLogo = value }
  },

  getters: {
    extendedCompanies: (state) => {
      const _companies = state.data.slice()

      _companies.unshift({
        id: 0,
        name: 'Not Assigned'
      })

      return _companies
    },
    companyName: (state) => (companyId) => {
      const company = state.companies.find((company) => companyId === company.id)

      return company ? company.name : 'Not Assigned'
    }
  }
}

export default module