import api from '@/api.js'
export default {
  /**
  * Get bytes usage for a specific router
  *
  * @param {}
  * @example
  *
  *     getBytesUsage()
  */
  getBytesUsage({ routerId, timeTo, timeFrom }) {
    return api.get(`/bytes-usage/${routerId}`, { 
      params: { 
        'timeTo': timeTo, 'timeFrom': timeFrom 
      } 
    })
  }
}