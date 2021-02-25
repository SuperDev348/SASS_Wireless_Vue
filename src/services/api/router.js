import api from '@/api.js'
export default {
  /**
  * Get routers
  *
  * @param {}
  * @example
  *
  *     getRouters()
  */
  getRouters() {
    return api.get('/routers')
  },

  /**
  * Assign router to a company
  *
  * @param {Object}
  * @example
  *
  *     assignCompany({
  *       routerId: 1,
  *       companyId: 2
  *     })
  */
  assignCompany(payload) {
    return api.post('/routers/assign-company', payload)
  },
  
  /**
  * Update router(customer assigned name especially)
  *
  * @param {Object}
  * @example
  *
  *     updateRouter({
  *       customerAssignedName: 'New Device Name'
  *     })
  */
  updateRouter(payload) {
    return api.put(`/routers/${payload.id}`, payload)
  }
}