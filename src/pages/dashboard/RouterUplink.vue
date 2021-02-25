<template>
  <div>
    <div>
      <h3 class="my-4 grey--text">
        Configuration
      </h3>

      <div class="my-3">
        <h4 class="my-2">GENERAL</h4>
        <div class="">
          <div class="d-flex pb-1">
            <span class="label grey--text">PUBLIC IP</span>
            <span>{{ router.ipv4_address }}</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text"></span>
            <span>{{ router.ipv4_address }}.detected.static</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text"></span>
            <span>sonic.net</span>
          </div>
        </div>
      </div>

      <div class="my-3">
        <h4 class="my-2">WAN</h4>
        <div class="">
          <div class="d-flex pb-1">
            <span class="label grey--text">STATUS</span>
            <span>ACTIVE</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text">IP(DHCP)</span>
            <span>10.10.10.2</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text">VIRTUAL IP</span>
            <span>{{ router.ip }}</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text">GETAWAY</span>
            <span>10.10.10.2</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text">DNS</span>
            <span>10.10.10.2</span>
          </div>
        </div>
      </div>

      <div class="my-3">
        <h4 class="my-2">Cellular</h4>
        <div class="">
          <div class="d-flex pb-1">
            <span class="label grey--text">STATUS</span>
            <span>Ready.Enabled</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text">IP</span>
            <span>10.10.10.2</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text">Type</span>
            <span></span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text">STRENGTH</span>
            <span>Excellent(-73dbm)</span>
          </div>
          <div class="d-flex pb-1">
            <span class="label grey--text">APN</span>
            <span>iot.aer.net</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    router: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
  .label {
    width: 100px;
  }
</style>