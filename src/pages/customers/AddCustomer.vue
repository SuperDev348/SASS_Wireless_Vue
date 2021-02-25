<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Add New Company</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab>Account</v-tab>
      <v-tab>Information</v-tab>
    </v-tabs>

    <v-tabs-items>
      <v-card v-show="tab === 0" class="my-2">
        <v-card-title>Basic Information</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column flex-sm-row">
            <div class="flex-grow-1 pt-2 pa-sm-2">
              <v-form ref="accountForm" v-model="isAccountFormValid" lazy-validation @submit.prevent="submit">
                <v-checkbox
                  v-model="isNewCompany"
                  label="New Company"
                ></v-checkbox>
                <v-text-field
                  v-if="isNewCompany"
                  v-model="companyName"
                  :rules="[$rules.required]"
                  dense
                  outlined
                  label="Company Name"
                  @input="clearError"
                >
                </v-text-field>
                <v-select
                  v-else
                  v-model="customer.companyId"
                  :items="companies"
                  label="Company Name"
                  placeholder="Choose from existing companies"
                  item-text="name"
                  item-value="id"
                  :return-object="false"
                  :rules="[$rules.required]"
                  outlined
                  dense
                  @input="clearError"
                ></v-select>
                <v-text-field
                  v-model="customer.username"
                  :rules="[$rules.required]"
                  :validate-on-blur="false"
                  label="Administrator Name"
                  placeholder="Jane Doe"
                  outlined
                  dense
                  @input="clearError"
                ></v-text-field>
                <v-text-field
                  v-model="customer.email"
                  :rules="[$rules.required, $rules.emailFormat]"
                  :validate-on-blur="false"
                  label="Administrator Email"
                  placeholder="jane.doe@example.com"
                  outlined
                  dense
                  @input="clearError"
                ></v-text-field>

                <error-component :error="errorMessages"></error-component>

                <div class="mt-2">
                  <v-btn
                    type="submit"
                    color="primary"
                    :loading="loading"
                  >Save</v-btn>
                </div>
              </v-form>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card v-show="tab === 1" class="my-2">
        <v-card-title>Account Information</v-card-title>
        <v-card-text ref="b">
          <v-form ref="profileForm" v-model="isProfileFormValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="customer.address"
                  label="Address"
                  :rules="[$rules.required]"
                  outlined
                  dense
                >
                </v-text-field>
                <v-select
                  v-model="customer.state"
                  label="State"
                  :items="states"
                  :rules="[$rules.required]"
                  outlined
                  dense
                  @change="onStateChange"
                >
                </v-select>
                <v-combobox
                  v-if="customer.state"
                  v-model="customer.city"
                  :items="cities"
                  label="City"
                  item-text="city"
                  :return-object="false"
                  :rules="[$rules.required]"
                  :disabled="loadingCities"
                  :loading="loadingCities"
                  outlined
                  dense
                ></v-combobox>
                <v-text-field
                  :value="zipCode"
                  label="Zip Code"
                  :rules="[$rules.required]"
                  :disabled="!customer.state || !customer.city"
                  outlined
                  dense
                  readonly
                >
                </v-text-field>
                <v-text-field
                  v-model="customer.country"
                  :rules="[$rules.required]"
                  label="Country"
                  outlined
                  dense
                  readonly
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="customer.phone"
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
              <v-btn color="primary" @click="onBack">Back</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-tabs-items>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Add Customer Page Component
| url: /customers/add
|---------------------------------------------------------------------
|
| Create a new customer
*/
import states from '../../services/data/states'
import ErrorComponent from '../../components/common/ErrorComponent'

import { mapState, mapActions } from 'vuex'

export default {
  components: {
    ErrorComponent
  },
  data() {
    return {
      tab: 0,

      breadcrumbs: [
        {
          text: 'Companies',
          to: '/customers',
          exact: true
        },
        {
          text: 'Add New Company'
        }
      ],
      
      states,

      isNewCompany: false,
      companyName: '',

      loading: false,

      customer: {
        companyId: 0,
        username: '',
        email: '',
        address: '',
        state: '',
        city: '',
        country: 'US',
        phone: ''
      },

      isAccountFormValid: true,
      isProfileFormValid: true
    }
  },
  computed: {
    ...mapState({
      userRole: (state) => state.auth.user.roleId, // role of current loggedin user
      cities: (state) => state.cities.data,
      errorMessages: (state) => state.customers.error,
      companies: (state) => state.customers.companies,
      loadingCities: (state) => state.cities.loadingCities
    }),
    zipCode() {
      const _zip = this.cities.find((city) => city.city === this.customer.city)

      return _zip ? _zip.zip : ''
    }
  },
  mounted() {
    this.getCompanies()
  },
  methods: {
    ...mapActions({
      addUser: 'users/addUser',
      createCompany: 'customers/createCompany',
      getCompanies: 'customers/getCompanies',
      getCities: 'cities/getCities'
    }),
    onStateChange() {
      this.getCities(this.customer.state)
    },
    async submit() {
      if (this.$refs.accountForm.validate()) {
        if (this.$refs.profileForm.validate()) {
          let companyId
        
          this.loading = true

          try {
            if (this.isNewCompany) {
              const response = await this.createCompany({
                name: this.companyName
              })

              companyId = response.data.data.id
            } else {
              companyId = this.customer.companyId
            }

            let role = 0

            if (this.userRole === 1)
              role = 4
            else if (this.userRole === 4)
              role = 5

            if (role) {
              await this.addUser({
                companyId,
                username: this.customer.username,
                email: this.customer.email,
                role,
                state: this.customer.state,
                zip: this.zipCode,
                city: this.customer.city,
                address: this.customer.address,
                phone: this.customer.phone,
                country: this.customer.country
              })

              this.$router.push({
                name: 'customers-list'
              })
            } else {
              console.log('Unauthorized')
            }
          } catch (err) {
            console.log(err)
          } finally {
            this.loading = false
          }
        } else {
          this.tab = 1
        }
      }
    },
    onBack() {
      if (this.$refs.profileForm.validate()) {
        this.tab = 0
      }
    },
    clearError() {
      this.$store.commit('customers/CLEAR_ERROR')
    }
  }
}
</script>
