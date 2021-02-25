import bytesUsageAPI from '../../services/api/bytes-usage'

const module = {
  namespaced: true,
  state: {
    data: [],
    error: null,
    loadingBytesUsage: false,
    timeTo: null,
    timeFrom: null,
    optionId: 1,
    dateOptions: [
      {
        id: 1,
        text: 'Last 12 Hours',
        value: 12
      }, {
        id: 2,
        text: 'Last 24 Hours',
        value: 24
      }, {
        id: 3,
        text: 'Last 3 Days',
        value: 3 * 24
      }, {
        id: 4,
        text: 'Last 7 Days',
        value: 7 * 24
      }, {
        id: 5,
        text: 'Last 15 Days',
        value: 15 * 24
      }, {
        id: 6,
        text: 'Last 30 Days',
        value: 30 * 24
      }, {
        id: 7,
        text: 'Custom Range',
        value: 0
      }
    ]
  },

  actions: {
    async getBytesUsage({ commit }, { routerId = null, timeTo, timeFrom }) {
      let To = null
      let From = null
      
      if (timeTo === null) {
        To = new Date()
      }
      else
        To = timeTo
      if (timeFrom === null) {
        From = new Date()
        From.setHours(From.getHours() - 12)
      }
      else {
        From = timeFrom
      }
      commit('SET_LOADING_BYTES_USAGE', true)

      try {
        const response = await bytesUsageAPI.getBytesUsage({ routerId, timeTo: To, timeFrom: From })

        commit('SET_DATA', response.data.data)
      } catch (error) {
        console.log(error)
      }

      commit('SET_LOADING_BYTES_USAGE', false)
    },
    setOptionId({ commit }, optionId = 1) {
      commit('SET_OPTION_ID', optionId)
    },
    setTimeTo({ commit }, time) {
      commit('SET_TIME_TO', time)
    },
    setTimeFrom({ commit }, time) {
      commit('SET_TIME_FROM', time)
    }
  },

  mutations: {
    SET_DATA(state, users) {
      state.data = users
    },
    SET_ERROR(state, error) {
      state.error = error.error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_LOADING_BYTES_USAGE(state, loading) { state.loadingBytesUsage = loading },
    SET_OPTION_ID(state, optionId) {
      state.optionId = optionId
    },
    SET_TIME_TO(state, time) {
      state.timeTo = time
    },
    SET_TIME_FROM(state, time) {
      state.timeFrom = time
    }
  },

  getters: {
  }
}

export default module