<template>
  <div>
    <div>
      <h3 class="my-4 grey--text">
        Configuration
      </h3>

      <div class="my-3">
        <h4 class="my-2">PORTS</h4>
        <v-sheet width="260" color="grey lighten-4" class="pa-1">
          <div class="d-flex">
            <div class="d-flex flex-column align-center mx-2">
              <span class="my-2">Ethernet</span>
              <v-icon :color="ethernetDevice ? 'green' : 'grey'" large>mdi-ethernet</v-icon>
              <span v-if="ethernetDevice" class="my-2">{{ ethernetDevice.pin_status }}</span>
            </div>
            <div class="d-flex flex-column mx-4">
              <span class="my-2">SIM Cards</span>
              <div class="d-flex">
                <div class="d-flex flex-column align-center mx-1">
                  <v-icon :color="sim1Device ? 'green' : 'grey'" large>mdi-sim</v-icon>
                  <span v-if="sim1Device" class="my-2">{{ sim1Device.pin_status }}</span>
                </div>
                <div class="d-flex flex-column align-center mx-1">
                  <v-icon :color="sim2Device ? 'green' : 'grey'" large>mdi-sim</v-icon>
                  <span v-if="sim2Device" class="my-2">{{ sim2Device.pin_status }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-sheet>
      </div>
    </div>

    <div>
      <h3 class="my-4 grey--text">
        Historical data
      </h3>

      <div class="my-3">
        <h4 class="mt-4">CONNECTIVITY</h4>
        <apexchart type="rangeBar" height="80" :options="connectivityChartOptions" :series="connectivitySeries"></apexchart>
      </div>

      <v-divider></v-divider>

      <div class="my-3">
        <div class="d-flex justify-space-between align-center mt-4">
          <h4>NETWORK USAGE</h4>
          <date-range @submit="changeDateRange"></date-range>
        </div>
        <div class="">
          <v-sheet width="260" color="grey lighten-4" class="d-flex justify-space-around pa-1">
            <div class="text-center">
              <div class="text-h5 my-1">Ethernet</div>
              <div>
                <span class="display-1">{{ bytesToSize(totalEthernet) }}</span>
                <span>{{ bytesToSizeUnit(totalEthernet) }}</span>
              </div>
            </div>
            <div class="text-center">
              <div class="text-h5 my-1">Modems</div>
              <div>
                <span class="display-1">{{ bytesToSize(totalModem) }}</span>
                <span>{{ bytesToSizeUnit(totalModem) }}</span>
              </div>
            </div>
          </v-sheet>
        </div>
        <apexchart type="area" height="350" :options="usageChartOptions" :series="usageSeries"></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import DateRange from '../../components/dashboard/DateRange'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    DateRange
  },
  props: {
    router: {
      type: Object,
      default: () => {}
    },
    devices: {
      type: Array,
      default: () => []
    },
    bytesUsages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      connectivitySeries: [
        // George Washington
        {
          name: 'George Washington',
          data: [
            {
              x: 'President',
              y: [
                new Date(1789, 3, 30).getTime(),
                new Date(1797, 2, 4).getTime()
              ]
            }
          ]
        },
        // John Adams
        {
          name: 'John Adams',
          data: [
            {
              x: 'President',
              y: [
                new Date(1797, 2, 4).getTime(),
                new Date(1801, 2, 4).getTime()
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState('bytesUsage', ['timeTo', 'timeFrom']),

    ethernetDevice() {
      const validDevice = this.devices.find((device) => device.service_type === 'Ethernet' && device.pin_status !== null)

      return validDevice ? validDevice : null
    },
    sim1Device() {
      const validDevice = this.devices.find((device) => device.service_type === 'LTE' && device.model.includes('SIM1') && device.pin_status !== null)

      return validDevice ? validDevice : null
    },
    sim2Device() {
      const validDevice = this.devices.find((device) => device.service_type === 'LTE' && device.model.includes('SIM2') && device.pin_status !== null)

      return validDevice ? validDevice : null
    },
    connectivityChartOptions() {
      return {
        chart: {
          type: 'rangeBar',
          toolbar: false
        },
        plotOptions: {
          bar: {
            horizontal: true,
            rangeBarGroupRows: true
          }
        },
        colors: [
          '#4CAF50',
          '#ea344e'
        ],
        fill: {
          type: 'solid'
        },
        xaxis: {
          type: 'datetime',
          axisBorder: {
            show: false
          },
          min: new Date(1789, 3, 30).getTime()
        },
        yaxis: {
          labels: {
            show: false
          },
          title: {
            text: undefined
          }
        },
        tooltip: {
          enabled: false
        },
        legend: {
          show: false
        },
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        }
      }
    },
    usageChartOptions() {
      return {
        chart: {
          type: 'area',
          zoom: {
            enabled: false
          },
          toolbar: false
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value + 'kb/s'
            }
          }
        },
        legend: {
          floating: true,
          position: 'top',
          offsetX: '100%',
          markers: {
            radius: 0
          },
          itemMargin: {
            horizontal: 16
          }
        }
      }
    },
    ethernetUsages() {
      return this.bytesUsages.filter((usage) => usage.device.service_type === 'Ethernet')
    },
    cellularUsages() {
      return this.bytesUsages.filter((usage) => usage.device.service_type === 'LTE')
    },
    usageSeries() {
      return [{
        name: 'Ethernet',
        data: this.ethernetUsages.map((usage) => [usage.created_at, (usage.bytes_in + usage.bytes_out) / 1000])
      }, {
        name: 'Cellular',
        data: this.cellularUsages.map((usage) => [usage.created_at, (usage.bytes_in + usage.bytes_out) / 1000])
      }]
    },
    totalEthernet() {
      let sum = 0

      this.ethernetUsages.forEach((usage) => {
        sum += usage.bytes_in + usage.bytes_out
      })

      return sum
    },
    totalModem() {
      let sum = 0

      this.cellularUsages.forEach((usage) => {
        sum += usage.bytes_in + usage.bytes_out
      })

      return sum
    }
  },
  methods: {
    ...mapActions({
      getBytesUsage: 'bytesUsage/getBytesUsage'
    }),
    bytesToSizeUnit(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

      if (bytes === 0) return 'B'
      
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

      return sizes[i]
    },
    bytesToSize(bytes) {
      if (bytes === 0) return '0'

      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      
      return Math.round(bytes / Math.pow(1024, i), 2)
    },
    changeDateRange({ timeTo, timeFrom }) {
      this.getBytesUsage({ routerId: this.router.id, timeTo, timeFrom })
    }
  }
}
</script>