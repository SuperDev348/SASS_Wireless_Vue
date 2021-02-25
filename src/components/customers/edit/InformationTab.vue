<template>
  <div>
    <v-card class="my-2">
      <v-card-title>Account Information</v-card-title>
      <v-card-text>
        <v-form
          v-if="user && user.profile"
          ref="profileForm"
          v-model="isProfileFormValid"
          lazy-validation
          @submit.prevent="submit"
        >
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.profile.address"
                label="Address"
                :rules="[$rules.required]"
                outlined
                dense
              >
              </v-text-field>
              <v-select
                v-model="user.profile.state"
                label="State"
                :items="states"
                :rules="[$rules.required]"
                outlined
                dense
                @change="onStateChange"
              >
              </v-select>
              <v-combobox
                v-model="user.profile.city"
                :items="cities"
                label="City"
                item-text="city"
                :return-object="false"
                :rules="[$rules.required]"
                :disabled="!user.profile.state"
                outlined
                dense
              ></v-combobox>
              <v-text-field
                :value="zipCode"
                label="Zip Code"
                :rules="[$rules.required]"
                :disabled="!user.profile.state || !user.profile.city"
                outlined
                dense
                readonly
              >
              </v-text-field>
              <v-text-field
                v-model="user.profile.country"
                :rules="[$rules.required]"
                label="Country"
                outlined
                dense
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.profile.phone"
                v-mask="'###-###-####'"
                placeholder="123-456-7890"
                :rules="[$rules.required, $rules.phoneFormat]"
                outlined
                dense
              >
              </v-text-field>
            </v-col>
          </v-row>

          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" :loading="isLoading">Save</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Information Tab Component
|---------------------------------------------------------------------
|
| Information tab in customer edit page
*/
import states from '../../../services/data/states'
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    isProfileFormValid: true,
    
    states
  }),
  computed: {
    ...mapState({
      isLoading: (state) => state.users.button_loading,
      cities: (state) => state.cities.data
    }),
    zipCode() {
      const _zip = this.cities.find((city) => city.city === this.user.profile.city)

      return _zip ? _zip.zip : ''
    }
  },
  methods: {
    ...mapActions({
      updateUserAccount: 'users/updateUserAccount',
      getCities: 'cities/getCities'
    }),
    onStateChange() {
      this.getCities(this.user.profile.state)
    },
    submit() {
      if (this.$refs.profileForm.validate()) {
        const data = Object.assign(this.user.profile, {
          zip: this.zipCode
        })

        this.updateUserAccount({
          id: this.user.id,
          state: this.user.profile.state,
          zip: this.user.profile.zip,
          city: this.user.profile.city,
          address: this.user.profile.address,
          phone: this.user.profile.phone,
          country: this.user.profile.country
        })
      }
    }
  }
}
</script>