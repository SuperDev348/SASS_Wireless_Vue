<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-row v-if="selectedRouter">
      <v-col cols="12" md="3">
        <div class="px-1 py-2">
          <h3 class="my-4">
            <v-icon
              :color="selectedRouter.state === 'online' ? 'green' : 'grey'"
              class="mr-1"
            >
              mdi-checkbox-blank-circle
            </v-icon>
            {{ selectedRouter.name }}
          </h3>

          <gmap-map ref="mmm" :center="center" :zoom="12" style="width: 100%; height: 300px">
            <gmap-marker
              v-for="(m, index) in markers"
              :key="index"
              :position="m.position"
              :clickable="true"
              :draggable="true"
              @click="center=m.position"
            ></gmap-marker>
          </gmap-map>

          <v-divider></v-divider>

          <div class="my-3">
            <div class="grey--text">WAN</div>
            <div class="d-flex justify-space-between align-center">
              <span>{{ selectedRouter.ipv4_address }}</span>
              <v-chip
                label
                color="green"
                dark
              >
                ACTIVE
              </v-chip>
            </div>

          </div>

          <div class="my-3">
            <div class="grey--text">CELLULAR</div>
            <div class="d-flex justify-space-between align-center">
              <span>Integrated</span>
              <v-spacer></v-spacer>
              <v-icon class="mr-1">mdi-chart-histogram</v-icon>
              <v-chip
                label
                color="green"
                dark
              >
                READY
              </v-chip>
            </div>
          </div>

          <div class="my-3">
            <div class="grey--text">HOST NAME</div>
            <div class="line-height-32">{{ selectedRouter.hostname }}</div>
          </div>

          <v-divider></v-divider>

          <div class="my-3">
            <div class="grey--text">SERIAL NUMBER</div>
            <div class="line-height-32">{{ selectedRouter.serial_number }}</div>
          </div>

          <v-divider></v-divider>

          <div class="my-3">
            <div class="grey--text">TAG</div>
          </div>

          <v-divider></v-divider>

          <div class="my-3">
            <div class="grey--text">NOTES</div>
          </div>

          <v-divider></v-divider>

          <div class="my-3">
            <div class="grey--text">FIREWARE</div>
            <div>Up to Date</div>
          </div>

        </div>
      </v-col>
      <v-col cols="12" md="9">
        <div class="px-1 py-2">
          <div class="text-center">
            <v-btn-toggle
              v-model="dashboardMode"
              rounded
              color="primary"
            >
              <v-btn>
                Summary
              </v-btn>
              <v-btn>
                Uplink
              </v-btn>
              <v-btn>
                DHCP
              </v-btn>
            </v-btn-toggle>
          </div>
          <router-summary v-if="dashboardMode === 0" :router="selectedRouter" :devices="devices" :bytes-usages="bytesUsages"></router-summary>
          <router-uplink v-else-if="dashboardMode === 1" :router="selectedRouter" :devices="devices"></router-uplink>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import RouterSummary from './RouterSummary'
import RouterUplink from './RouterUplink'

export default {
  components: {
    RouterSummary,
    RouterUplink
  },
  data() {
    return {
      dashboardMode: 0,
      center: {
        lat: 41.14961,
        lng: -8.61099
      },
      markers: [{
        position: {
          lat: 41.14961,
          lng: -8.61099
        }
      }, {
        position: {
          lat: 41.94961,
          lng: -8.61099
        }
      }]
    }
  },
  computed: {
    ...mapState({
      routers: (state) => state.auth.user.routers,
      devices: (state) => state.devices.data,
      bytesUsages: (state) => state.bytesUsage.data,
      timeTo: (state) => state.bytesUsage.timeTo,
      timeFrom: (state) => state.bytesUsage.timeFrom
    }),
    selectedRouter() {
      return this.routers.find((router) => router.id === parseInt(this.$route.params.id))
    }
  },
  mounted() {
    // const geocoder = new google.maps.Geocoder()
    
    // geocoder.geocode({
    //   'address': 'US/Mountains'
    // }, function(results) {
    //   console.log(results[0].geometry.location)
    // })
    this.getDevices(this.$route.params.id)
    this.getBytesUsage({ routerId: this.$route.params.id, timeTo: this.timeTo, timeFrom: this.timeFrom })
  },
  methods: {
    ...mapActions('devices', ['getDevices']),
    ...mapActions('bytesUsage', ['getBytesUsage'])
  }
}
</script>
<style scoped>
  .v-chip {
    width: 72px;
  }
  .line-height-32 {
    line-height: 32px;
  }
</style>