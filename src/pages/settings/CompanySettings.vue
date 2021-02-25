<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="py-3">
      <div class="display-1 mb-3">General Settings</div>
      <v-alert
        dense
        text
        color="primary"
        type="info"
      >
        <div style="color: black;">
          <div class="d-flex justify-space-between mb-1">
            <div class="font-weight-bold">KORE Wireless Terms of Service</div>
            <v-btn text color="primary">Accept</v-btn>
          </div>
          Unless otherwise agreed with KORE Wireless, your organization's use of and acacess to the Products is subject to KORE Wireless's <a href="https://shop.korewireless.com/pages/terms-and-conditions" target="blank">terms of service</a>. By continuing to use the Products, you agree to these terms on behalf of your organization and warrant that you have the authority to do so.
        </div>
      </v-alert>
    </div>

    <v-row dense>
      <v-col cols="12" md="4">
        <div class="text-h5">Organization Information</div>
      </v-col>
      <v-col cols="12" md="8">
        <v-card v-if="company" outlined width="500">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div class="title">Organization Name</div>
              <v-btn
                text
                color="primary"
                @click="openNameDialog"
              >
                <v-icon left>
                  mdi-pencil
                </v-icon>
                Edit
              </v-btn>
            </div>
            <div class="subtitle-1">{{ company.name }}</div>
          </v-card-text>
        </v-card>

        <br>

        <v-card v-if="company" outlined width="500">
          <v-card-text>
            <div class="title">Logo</div>
            <v-radio-group v-model="company.logoType">
              <v-radio
                label="Default logo"
                :value="0"
              ></v-radio>
              <v-radio
                label="Use logo from link"
                :value="1"
              ></v-radio>
              <v-form
                v-if="company.logoType === 1"
                ref="logoLinkForm"
                v-model="isLogoLinkFormValid"
                lazy-validation
                class="px-4 my-1"
                @submit.prevent="saveLogoLink"
              >
                <v-text-field
                  v-model="company.logoLink"
                  label="Organizaion Name"
                  outlined
                  dense
                  :rules="[$rules.required]"
                >
                </v-text-field>
              </v-form>
              <v-radio
                label="Upload"
                :value="2"
              ></v-radio>
              <v-card v-if="company.logoType === 2">
                <v-card-text>
                  <v-img
                    contain
                    width="260"
                    height="160"
                    :eager="true"
                    :src="logoFileSrc"
                    class="mx-auto mb-2"
                    style="border: 1px dashed #ccc;"
                  >
                  </v-img>
                  <div class="d-flex flex-wrap">
                    <v-file-input
                      v-model="logoFileInput"
                      accept="image/*"
                      label="New Logo Image"
                      outlined
                      dense
                      prepend-icon="mdi-camera"
                      @change="prepareLogo"
                    >
                      <template v-slot:append-outer>
                        <v-btn
                          color="primary"
                          fab
                          small
                          class="mt-n1"
                          :loading="uploadingLogo"
                          :disabled="uploadingLogo || !logoFileInput"
                          @click="handleUpload"
                        >
                          <v-icon>
                            mdi-cloud-upload
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-file-input>
                  </div>
                </v-card-text>
              </v-card>
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-if="company"
      v-model="editNameDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="primary white--text">Organizaion Name</v-card-title>
        <v-card-text class="mt-2">
          <v-form ref="editNameForm" v-model="isEditFormValid" lazy-validation @submit.prevent="saveName">
            <v-text-field
              v-model="company.name"
              label="Organizaion Name"
              outlined
              dense
              :rules="[$rules.required]"
            >
            </v-text-field>
            <div class="d-flex">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="editNameDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="savingOrganizationName"
                :disabled="savingOrganizationName"
              >
                Save
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      logoFileInput: undefined,
      logoFileSrc: '',
      editNameDialog: false,
      savingOrganizationName: false,
      isEditFormValid: true,
      isLogoLinkFormValid: true
    }
  },
  computed: {
    ...mapState({
      uploadingLogo: (state) => state.customers.uploadingLogo,
      authUser: (state) => state.auth.user,
      company: (state) => state.customers.company
    })
  },
  mounted() {
    this.getCompany(this.authUser.companyId)
  },
  methods: {
    ...mapActions({
      'uploadLogo': 'customers/uploadLogo',
      'updateCompany': 'customers/updateCompany',
      'getCompany': 'customers/getCompany'
    }),

    prepareLogo(file) {
      if (file) {
        const reader = new FileReader()

        reader.readAsDataURL(file)
        reader.onload = () => {
          this.logoFileSrc = reader.result
        }
      }
    },

    handleUpload() {
      const formData = new FormData()

      formData.append('logo', this.logoFileInput)
      formData.append('logoType', this.company.logoType)

      this.uploadLogo({
        formData
      })
    },

    openNameDialog() {
      this.companyName = ''
      this.editNameDialog = true
    },

    async saveName() {
      if (this.$refs.editNameForm.validate()) {
        this.savingOrganizationName = true

        try {
          await this.updateCompany({
            id: this.authUser.companyId,
            name: this.company.name
          })

          this.editNameDialog = false
        } catch (err) {
          console.log(err)
        }

        this.savingOrganizationName = false
      }
    },

    async saveLogoLink() {
      if (this.$refs.logoLinkForm.validate()) {
        try {
          await this.updateCompany({
            id: this.authUser.companyId,
            logoType: this.company.logoType,
            logoLink: this.company.logoLink
          })

          this.editNameDialog = false
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
}
</script>