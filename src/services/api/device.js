import api from '@/api.js'
export default {
  /**
  * Get devices
  *
  * @param {}
  * @example
  *
  *     getDevices()
  */
  getDevices(routerId) {
    return api.get(`/devices?routerId=${routerId}`)
  }
}