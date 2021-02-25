import api from '@/api.js'
export default {
  /**
  * Get company admins
  *
  * @param {}
  * @example
  *
  *     getCompanyAdmins()
  */
  getCompanyAdmins() {
    return api.get('/companies/admins')
  },

  /**
  * Get companies
  *
  * @param {}
  * @example
  *
  *     getCompanies()
  */
  getCompanies() {
    return api.get('/companies')
  },

  /**
  * Get company
  *
  * @param {}
  * @example
  *
  *     getCompany()
  */
  getCompany(id) {
    return api.get(`/companies/${id}`)
  },

  /**
  * Create a new company
  *
  * @param {Object}
  * @example
  *
  *     createCompany({
  *       name: 'Company Name'
  *     })
  */
  createCompany(payload) {
    return api.post('/companies', payload)
  },

  /**
  * Create a new company
  *
  * @param {Object}
  * @example
  *
  *     updateCompany({
  *       name: 'Company Name'
  *     })
  */
  updateCompany(payload) {
    return api.put(`/companies/${payload.id}`, payload)
  },

  /**
  * Upload company logo
  *
  * @param {Object}
  */
  uploadLogo(data) {
    return api.post('/companies/upload-logo', data)
  },

  createCustomerWithDevices(payload) {
    return api.post('/companies/create-with-devices', payload)
  },

  updateCustomerWithDevices(payload) {
    return api.post('/companies/update-with-devices', payload)
  }
}