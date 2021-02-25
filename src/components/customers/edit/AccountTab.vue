<template>
  <div>
    <v-card class="my-2">
      <v-card-title>Basic Information</v-card-title>
      <v-card-text>
        <div class="d-flex flex-column flex-sm-row">
          <div class="flex-grow-1 pt-2 pa-sm-2">
            <v-form
              v-if="user"
              ref="accountForm"
              v-model="isAccountFormValid"
              lazy-validation
              @submit.prevent="submit"
            >
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
                @input="resetErrors">
              </v-text-field>
              <v-select
                v-else
                v-model="user.companyId"
                :items="companies"
                label="Company Name"
                placeholder="Choose from existing companies"
                item-text="name"
                item-value="id"
                :return-object="false"
                :rules="[$rules.required]"
                outlined
                dense
                @input="resetErrors"
              ></v-select>
              <v-text-field
                v-model="user.username"
                :rules="[$rules.required]"
                :validate-on-blur="false"
                dense
                outlined
                label="Administrator Name"
                @input="resetErrors"
              ></v-text-field>
              <v-text-field
                v-model="user.email"
                :rules="[$rules.required, $rules.emailFormat]"
                :validate-on-blur="false"
                dense
                outlined
                label="Administrator Email"
                @input="resetErrors"
              ></v-text-field>

              <error-component :error="error"></error-component>

              <div class="d-flex mt-2">
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" :loading="loading">Save</v-btn>
              </div>
            </v-form>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
/*
|---------------------------------------------------------------------
| Account Tab Component
|---------------------------------------------------------------------
|
| Account tab in customer edit page
*/
import { mapState, mapActions } from 'vuex'
import ErrorComponent from '../../common/ErrorComponent'

export default {
  components: {
    ErrorComponent
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    companies: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      isAccountFormValid: true,
      loading: false,

      isNewCompany: false,
      companyName: ''
    }
  },
  computed: {
    ...mapState({
      error: (state) => state.customers.error
    })
  },
  destroyed() {
    this.resetErrors()
  },
  methods: {
    ...mapActions({
      updateUserAccount: 'users/updateUserAccount',
      createCompany: 'customers/createCompany',
      updateCompany: 'customers/updateCompany'
    }),
    async submit() {
      if (this.$refs.accountForm.validate()) {
        let companyId
        
        this.loading = true

        try {
          if (this.isNewCompany) {
            const response = await this.createCompany({
              name: this.companyName
            })

            companyId = response.data.data.id
          } else {
            companyId = this.user.companyId
          }

          await this.updateUserAccount({
            id: this.user.id,
            companyId,
            username: this.user.username,
            email: this.user.email
          })
        } catch (err) {
          console.log(err)
        } finally {
          this.loading = false
        }
      }
    },
    resetErrors() {
      this.$store.commit('auth/CLEAR_ERROR')
    }
  }
}
</script>
