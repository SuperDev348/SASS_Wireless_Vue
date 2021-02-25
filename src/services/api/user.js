import api from '@/api.js'
export default {
  /**
  * Get kore users
  *
  * @param {}
  * @example
  *
  *     getKoreUsers()
  */
  getKoreUsers() {
    return api.get('/users/kore-users')
  },

  /**
  * Get company users
  *
  * @param {}
  * @example
  *
  *     getKoreUsers()
  */
  getCompanyUsers() {
    return api.get('/users/company-users')
  },

  /**
  * Get existing user to edit page
  *
  * @param {number}
  * @example
  *
  *     openEditUser(2)
  */
  openEditUser(id) {
    return api.get(`/users/${id}/edit`)
  },

  /**
  * Add a new user
  *
  * @param {Object} user object for a new user
  * @example
  *
  *     addUser(user)
  */
  addUser(data) {
    return api.post('/users', data)
  },

  /**
  * Update a user
  *
  * @param {Object} user object
  * @example
  *
  *     updateUserAccount(user)
  */
  updateUserAccount(data) {
    return api.put(`/users/${data.id}`, data)
  }
}