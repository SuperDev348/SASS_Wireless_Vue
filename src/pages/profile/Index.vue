<template>
  <div class="d-flex flex-column flex-grow-1">
    <div>      
      <v-row dense>
        <v-col cols="12" sm="4">
          <Overview :user="user"></Overview>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card height="300">
            <v-card-text>
              <v-tabs v-model="tab">
                <v-tab>Personal Info</v-tab>
                <v-tab>Password</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab" class="my-2">
                <v-tab-item>
                  <personal-info
                    :is-btn-loading="isBtnLoading"
                    :user="user"
                    :error="error"
                    @clearError="clearError"
                  >
                  </personal-info>
                </v-tab-item>
                <v-tab-item>
                  <password-reset
                    :is-btn-loading="isBtnLoading"
                    :error="error"
                    @submit="submitPassword"
                    @clearError="clearError"
                  >
                  </password-reset>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import PersonalInfo from '../../components/profile/PersonalInfo'
import PasswordReset from '../../components/profile/PasswordReset'
import Overview from '../../components/profile/Overview'

import { mapState, mapActions } from 'vuex'

export default {
  components: {
    PasswordReset,
    PersonalInfo,
    Overview
  },
  data() {
    return {
      tab: null
    }
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.auth.button_loading,
      user: (state) => state.auth.user,
      error: (state) => state.auth.error
    })
  },
  methods: {
    ...mapActions({
      updatePassword: 'auth/updatePassword',
      updateTimezome: 'auth/updateTimezome',
      clearError: 'auth/clearError'
    }),
    submitPassword(data) {
      this.updatePassword(data)
    },
    submitTimezone(data) {
      this.updateTimezome(data)
    }
  }
}
</script>
