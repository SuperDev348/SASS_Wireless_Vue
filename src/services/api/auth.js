import api from '@/api.js'
export default {
  /**
  * Sign in using email and password
  *
  * @param {string} email
  * @param {string} password
  * @example
  *
  *     signIn('almesri@machinecdn.com', 'password')
  */
  signIn(email, password) {
    const data = {
      email,
      password
    }

    return api.post('/auth/signin', data).then((response) => {
      return response
    })
  },

  /**
  * Update user password
  *
  * @param {string} currentPassword
  * @param {string} newPassword
  * @example
  *
  *     updatePassword('password', 'PASSWORD')
  */
  updatePassword(currentPassword, newPassword) {
    const data = {
      current_password: currentPassword,
      new_password: newPassword
    }

    return api.post('/auth/update-password', data).then((response) => {
      return response
    })
  },

  /**
  * Send forgot password request
  *
  * @param {string} email
  * @example
  *
  *     requestForgotPassword('almesri@machinecdn.com')
  */
  requestForgotPassword(email) {
    const data = {
      email: email
    }

    return api.post('/auth/password-reset', data).then((response) => {
      return response
    })
  },

  /**
  * Send sign out request
  *
  * @example
  *
  *     signOut()
  */
  signOut() {
    return api.get('/auth/logout').then((response) => {
      return response
    })
  },

  /**
  * Check if user is logged in using token and get user info(role, name, email, company)
  *
  * @example
  *
  *     check()
  */
  check() {
    return api.get('/auth/me').then((response) => {
      return response
    })
  }
}