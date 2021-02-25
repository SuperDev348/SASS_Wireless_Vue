<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Routers</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      
      <v-spacer></v-spacer>
      <v-btn v-if="canCreateCompanies" color="primary" @click="onCreateCompanyClicked">
        <v-icon left>mdi-plus</v-icon>
        Create Company
      </v-btn>
    </div>

    <v-card>

      <v-card-text>
        <v-row dense justify="end">
          <v-col cols="6" class="d-flex text-right align-center">
            <v-text-field
              v-model="searchQuery"
              append-icon="mdi-magnify"
              class="flex-grow-1 mr-md-2"
              solo
              hide-details
              dense
              clearable
              placeholder="e.g. filter for id, name, etc"
            ></v-text-field>
            <v-btn
              :loading="loadingRouters"
              icon
              small
              class="ml-2"
              @click="getRouters"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-data-table
          v-model="selectedRouters"
          :headers="headers"
          :items="routers"
          :search="searchQuery"
          class="flex-grow-1"
          :loading="loadingRouters"
          group-by="companyId"
        >
          <template v-slot:group.header="{ group, headers, toggle, isOpen }">
            <td :colspan="headers.length">
              <div class="d-flex align-center">
                <v-btn @click="toggle" icon :ref="group">
                  <v-icon v-if="isOpen">mdi-chevron-down</v-icon>
                  <v-icon v-else>mdi-chevron-up</v-icon>
                </v-btn>
                <span class="mx-2 font-weight-bold">{{ companyName(group) }}</span>
                <v-btn v-if="group" icon @click="openEditCompany(group)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="createCompanyDialog"
      width="600px"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text">
          {{ editedCompanyIndex === -1 ? 'Create a new company' : 'Update company' }}
          <v-btn icon color="white" class="ml-auto" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-2">
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step
                :complete="e1 > 1"
                step="1"
              >
                Create a company
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                :complete="e1 > 2"
                step="2"
              >
                KORE API Credentials
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 3" step="3">
                Assign devices
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-form
                  v-if="editedCompanyIndex === -1"
                  ref="customerForm"
                  v-model="isCompanyFormValid"
                  lazy-validation
                  class="mt-2"
                  @submit.prevent="continueCompany"
                >
                  <v-checkbox
                    v-model="isNewCompany"
                    label="New Company"
                  ></v-checkbox>
                  <v-text-field
                    v-if="isNewCompany"
                    v-model="companyForm.companyName"
                    :rules="[$rules.required]"
                    dense
                    outlined
                    label="Company Name"
                    @input="clearError"
                  >
                  </v-text-field>
                  <v-select
                    v-else
                    v-model="companyForm.companyId"
                    :items="companies"
                    label="Company Name"
                    placeholder="Choose from existing companies"
                    item-text="name"
                    item-value="id"
                    :return-object="false"
                    :rules="[$rules.required]"
                    outlined
                    dense
                  ></v-select>
                  <v-text-field
                    v-model="companyForm.adminName"
                    :rules="[$rules.required]"
                    dense
                    outlined
                    label="Customer Admin Name"
                    @input="clearError"
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="companyForm.adminEmail"
                    :rules="[$rules.required, $rules.emailFormat]"
                    dense
                    outlined
                    label="Customer Admin Email"
                    @input="clearError"
                  >
                  </v-text-field>
                  <div class="mt-2 text-right">
                    <v-btn
                      type="submit"
                      color="primary"
                    >Continue</v-btn>
                  </div>
                </v-form>
                <v-form
                  v-else
                  ref="customerEditForm"
                  v-model="isCompanyEditFormValid"
                  lazy-validation
                  class="mt-2"
                  @submit.prevent="continueEditCompany"
                >
                  <v-text-field
                    v-model="companyEditForm.name"
                    :rules="[$rules.required]"
                    dense
                    outlined
                    label="Company Name"
                  >
                  </v-text-field>
                  <div class="mt-2 text-right">
                    <v-btn
                      type="submit"
                      color="primary"
                    >Continue</v-btn>
                  </div>
                </v-form>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-form
                  lazy-validation
                  class="mt-2"
                  @submit.prevent="e1 = 3"
                >
                  <v-text-field
                    v-model="cradleForm.cradleUsername"
                    dense
                    outlined
                    label="KORE API Username"
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="cradleForm.cradlePassword"
                    dense
                    outlined
                    label="KORE API Password"
                    type="password"
                  >
                  </v-text-field>
                  <div class="mt-2 text-right">
                    <v-btn text @click="e1 = 1">
                      Back
                    </v-btn>
                    <v-btn
                      type="submit"
                      color="primary"
                    >Continue</v-btn>
                  </div>
                </v-form>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-form
                  ref="companyDevicesForm"
                  v-model="isCompanyDevicesFormValid"
                  lazy-validation
                  class="mt-2"
                >
                  <div class="added-devices-list mb-1">
                    <div
                      v-for="(device, index) in addedDevices"
                      :key="index"
                      class="d-flex justify-space-between pb-1"
                    >
                      <div>
                        <div class="subtitle-1">
                          Device: {{ addedDeviceText(device.deviceId) }}
                        </div>
                        <div>
                          SIM1: {{ addedDeviceSim(device.sim1) }}
                        </div>
                        <div>
                          SIM2: {{ addedDeviceSim(device.sim2) }}
                        </div>
                      </div>
                      <div>
                        <v-btn icon @click="removeAddedDevice(device)">
                          <v-icon color="red">mdi-minus</v-icon>
                        </v-btn>
                        <v-btn icon @click="editAddedDevice(device)">
                          <v-icon color="primary lighten-1">mdi-pencil</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>

                  <v-divider v-if="addedDevices.length > 0 && visibleAddForm"></v-divider>

                  <v-expand-transition>
                    <div v-show="visibleAddForm" class="mt-2 text-right">
                      <v-select
                        v-model="companyDevicesForm.deviceId"
                        :items="routers"
                        label="Select Device"
                        item-text="serial_number"
                        item-value="id"
                        outlined
                        dense
                        :rules="[$rules.required]"
                      >
                        <template v-slot:item="{ item }">
                          {{ `${item.serial_number} (${item.name})` }}
                        </template>
                      </v-select>
                      <v-text-field
                        v-model="companyDevicesForm.sim1"
                        dense
                        outlined
                        label="SIM 1"
                      >
                      </v-text-field>
                      <v-text-field
                        v-model="companyDevicesForm.sim2"
                        dense
                        outlined
                        label="SIM 2"
                      >
                      </v-text-field>
                      <div v-if="editedDeviceIndex === -1">
                        <v-btn v-if="visibleAddForm" text @click="visibleAddForm = false">
                          Cancel
                        </v-btn>
                        <v-btn color="primary" class="ml-1" @click="addDevice(true)">
                          <v-icon left>mdi-plus</v-icon>
                          Add more
                        </v-btn>
                        <v-btn v-if="visibleAddForm" color="primary" class="ml-1" @click="addDevice(false)">
                          <v-icon left>mdi-check</v-icon>
                          Done
                        </v-btn>
                      </div>
                      <div v-if="editedDeviceIndex !== -1">
                        <v-btn text @click="visibleAddForm = false">
                          Cancel
                        </v-btn>
                        <v-btn color="primary" class="ml-1" @click="saveDevice()">
                          Save
                        </v-btn>
                      </div>
                    </div>
                  </v-expand-transition>
                  <div v-if="!visibleAddForm" class="text-right">
                    <v-btn text @click="e1 = 2">
                      Back
                    </v-btn>
                    <v-btn color="primary" class="ml-1" @click="addMoreDevices()">
                      <v-icon left>mdi-plus</v-icon>
                      Add more devices
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="e1 = 4"
                      class="ml-1"
                    >Continue</v-btn>
                  </div>
                </v-form>
              </v-stepper-content>

              <v-stepper-content step="4">
                <div v-if="editedCompanyIndex === -1">
                  <span class="subtitle-1">Company: </span>{{ companyForm.companyName }}
                </div>
                <div v-else>
                  <span class="subtitle-1">Company: </span>{{ companyEditForm.name }}
                </div>
                <div v-if="editedCompanyIndex === -1">
                  <span class="subtitle-1">Customer: </span>{{ `${companyForm.adminName} (${companyForm.adminEmail})` }}
                </div>
                <div><span class="subtitle-1">KORE API username: </span>{{ cradleForm.cradleUsername }}</div>
                <div class="subtitle-1">Devices</div>
                <div class="pl-2">
                  <div class="added-devices-list mb-1">
                    <div
                      v-for="(device, index) in addedDevices"
                      :key="index"
                      class="d-flex justify-space-between pb-1"
                    >
                      <div>
                        <div>
                          Device: {{ addedDeviceText(device.deviceId) }}
                        </div>
                        <div>
                          SIM1: {{ addedDeviceSim(device.sim1) }}
                        </div>
                        <div>
                          SIM2: {{ addedDeviceSim(device.sim2) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-2 text-right">
                  <v-btn text @click="e1 = 3">
                    Back
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="submit"
                    :loading="creatingCompany"
                    :disabled="creatingCompany"
                  >Submit</v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
      breadcrumbs: [{
        text: 'Routers',
        disabled: false,
        href: '#'
      }, {
        text: 'List'
      }],

      searchQuery: '',
      selectedRouters: [],
      headers: [
        { text: 'Serial Number', align: 'left', value: 'serial_number' },
        { text: 'Router Model', align: 'left', value: 'full_product_name' },
        { text: 'Company', align: 'left', value: 'companyId' },
        { text: 'SIM1 ICCID', value: 'sim1' },
        { text: 'SIM2 ICCID', value: 'sim2' }
      ],

      editDialog: false,
      isEditFormValid: false,
      editedIndex: -1,
      editedItem: {
        companyId: 0
      },
      savingAssignment: false,

      e1: 1,

      createCompanyDialog: false,

      isNewCompany: true,

      isCompanyEditFormValid: true,
      editedCompanyIndex: -1,
      companyEditForm: {
        name: ''
      },

      isCompanyFormValid: false,
      companyForm: {
        companyId: 0,
        companyName: '',
        adminName: '',
        adminEmail: ''
      },

      cradleForm: {
        cradleUsername: '',
        cradlePassword: ''
      },

      isCompanyDevicesFormValid: true,
      visibleAddForm: true,
      editedDeviceIndex: -1,
      addedDevices: [],
      companyDevicesForm: {
        deviceId: '',
        sim1: '',
        sim2: ''
      },

      creatingCompany: false
    }
  },
  computed: {
    ...mapState({
      routers: (state) => state.routers.data,
      loadingRouters: (state) => state.routers.loadingRouters,
      companies: (state) => state.customers.companies
    }),
    ...mapGetters({
      companyName: 'customers/companyName',
      canCreateCompanies: 'auth/canCreateCompanies'
    })
  },
  mounted() {
    this.getCompanies()
    this.getRouters()
  },
  methods: {
    ...mapActions({
      getRouters: 'routers/getRouters',
      getCompanies: 'customers/getCompanies',
      createCustomerWithDevices: 'customers/createCustomerWithDevices',
      updateCustomerWithDevices: 'customers/updateCustomerWithDevices'
    }),

    editItem(item) {
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
      this.$nextTick(() => {
        this.$refs.editForm.resetValidation()
      })
    },
    
    async save () {
      if (this.$refs.editForm.validate()) {
        this.savingAssignment = true

        try {
          await this.assignCompany({
            routerId: this.editedIndex,
            companyId: this.editedItem.companyId
          })

          this.editDialog = false
          this.getRouters()
        } catch (err) {
          console.log(err)
        }

        this.savingAssignment = false
      }
    },

    onCreateCompanyClicked() {
      this.editedCompanyIndex = -1
      this.createCompanyDialog = true
      this.$nextTick(() => {
        this.$refs.customerForm.resetValidation()
        this.$refs.companyDevicesForm.resetValidation()
      })
    },

    continueCompany() {
      if (this.$refs.customerForm.validate()) {
        this.e1 = 2
      }
    },

    continueEditCompany() {
      if (this.$refs.customerEditForm.validate()) {
        this.e1 = 2
      }
    },

    addedDeviceText(id) {
      const r = this.routers.find((router) => router.id === id)

      if (r) {
        return `${r.serial_number} (${r.name})`
      } else {
        return 'Invalid Device'
      }
    },

    addedDeviceSim(sim) {
      return sim ? sim : 'Not Added'
    },

    addDevice(isMore) {
      if (this.$refs.companyDevicesForm.validate()) {
        this.addedDevices.push(this.companyDevicesForm)
        this.companyDevicesForm = Object.assign({}, {
          deviceId: '',
          sim1: '',
          sim2: ''
        })

        if (!isMore) this.visibleAddForm = false
      }
    },

    addMoreDevices() {
      this.companyDevicesForm = Object.assign({}, {
        deviceId: '',
        sim1: '',
        sim2: ''
      })
      this.$refs.companyDevicesForm.resetValidation()
      this.visibleAddForm = true
    },

    saveDevice() {
      const editedDevice = this.addedDevices.find((device) => device.id === this.editedDeviceIndex)

      if (editedDevice) {
        editedDevice.deviceId = this.companyDevicesForm.deviceId
        editedDevice.sim1 = this.companyDevicesForm.sim1
        editedDevice.sim2 = this.companyDevicesForm.sim2
        this.visibleAddForm = false
      }

      this.editedDeviceIndex = -1
    },
    
    openEditCompany(companyId) {
      this.editedCompanyIndex = companyId
      this.visibleAddForm = false

      const company = this.companies.find((c) => c.id === companyId)
      
      this.companyEditForm.name = company.name

      this.cradleForm = {
        cradleUsername: company ? company.crandleUsername : ''
      }

      const companyDevices = this.routers.filter((router) => router.companyId === companyId)

      this.addedDevices = companyDevices.map((device) => {
        return {
          deviceId: device.id,
          sim1: device.sim1,
          sim2: device.sim2
        }
      })

      this.createCompanyDialog = true
    },

    removeAddedDevice(device) {
      const index = this.addedDevices.indexOf(device)

      this.addedDevices.splice(index, 1)
    },

    editAddedDevice(device) {
      this.editedDeviceIndex = device.id
      this.companyDevicesForm = Object.assign({}, device)
      this.visibleAddForm = true
    },

    async submit() {
      this.creatingCompany = true

      if (this.editedCompanyIndex === -1) {
        try {
          const response = await this.createCustomerWithDevices({
            isNewCompany: this.isNewCompany,
            companyId: this.companyForm.companyId,
            companyName: this.companyForm.companyName,
            adminName: this.companyForm.adminName,
            adminEmail: this.companyForm.adminEmail,
            cradleUsername: this.cradleForm.cradleUsername,
            cradlePassword: this.cradleForm.cradlePassword,
            devices: this.addedDevices
          })

          this.$store.dispatch('app/showSuccess', response.data.message, { root: true })
        } catch (err) {
          console.log(err.response)
          // this.$store.dispatch('app/showSuccess', 'Successfully created', { root: true })
        }
      } else {
        try {
          const response = await this.updateCustomerWithDevices({
            id: this.editedCompanyIndex,
            name: this.companyEditForm.name,
            cradleUsername: this.cradleForm.cradleUsername,
            cradlePassword: this.cradleForm.cradlePassword,
            devices: this.addedDevices
          })

          this.$store.dispatch('app/showSuccess', response.data.message, { root: true })
        } catch (err) {
          console.log(err.response)
          // this.$store.dispatch('app/showError', err, { root: true })
        }
      }

      this.creatingCompany = false

      this.getCompanies()
      this.getRouters()
      this.close()
    },

    close() {
      this.createCompanyDialog = false
      setTimeout(() => {
        this.e1 = 1
        this.companyForm = {
          companyName: '',
          adminName: '',
          adminEmail: ''
        }
        this.cradleForm = {
          cradleUsername: '',
          cradlePassword: ''
        }
        this.companyDevicesForm = {
          deviceId: '',
          sim1: '',
          sim2: ''
        }
        this.addedDevices = []
      }, 100)
    },

    clearError() {
      this.$store.commit('customers/CLEAR_ERROR')
    }
  }
}
</script>
<style scoped>
  .added-devices-list {
    max-height: 260px;
    overflow-y: auto;
  }
</style>