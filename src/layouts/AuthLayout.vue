<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="5" lg="4">
        <v-sheet class="text-center mx-md-1 flex-md-column px-2 grey lighten-4">
          <div class="mt-3 mt-md-10 pa-2">
            <v-img class="mx-auto logo" src="/images/logo.png" > </v-img>
          </div>
          <slot></slot>
          <div class="overline mt-4">{{ product.name }} - {{ product.version }}</div>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="7" lg="8" class="pa-0">
        <div class="d-none d-md-flex" style="height: 100vh;">
          <div class="w-full">
            <v-img class="w-full" src="/images/auth-background.png"></v-img>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      logoImgError: false
    }
  },
  computed: {
    ...mapState('app', ['product']),
    ...mapState({
      authBackgroundFile: (state) => state.settings.auth_background_file,
      logoFile: (state) => state.settings.logo_file
    }),
    authBackground() {
      return {
        'background-image': '../assets/imgs/auth-background.png',
        // 'background-size': 'cover',
        'background-position': 'center center',
        'background-size': '100% 100%'
      }
    },
    logoFilePath() {
      return this.logoImgError ? require('../assets/imgs/logo-aec.png') : this.logoFile
    }
  },
  methods: {
    onLogoImgError() {
      this.logoImgError = true
    }
  }
}
</script>

<style scoped>
.logo {
  max-width: 140px;
  max-height: 60px;
}

.w-full {
  height: 100%;
}
</style>
