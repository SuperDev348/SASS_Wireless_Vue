<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Device Names</div>
      </div>
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
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="editItem(item)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="editDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="primary white--text">Assign Routers</v-card-title>
        <v-card-text class="mt-2">
          <v-form ref="editForm" v-model="isEditFormValid" lazy-validation @submit.prevent="save">
            <v-text-field
              v-model="editedItem.customerAssignedName"
              label="Assign a New Name"
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
                @click="editDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="savingAssignment"
                :disabled="savingAssignment"
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
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
      searchQuery: '',
      selectedRouters: [],
      headers: [
        { text: 'Serial Number', align: 'left', value: 'serial_number' },
        { text: 'Device Name', align: 'left', value: 'name' },
        { text: 'Customer Assigned Name', align: 'left', value: 'customerAssignedName' },
        { text: 'Edit', value: 'actions' }
      ],

      editDialog: false,
      isEditFormValid: false,
      editedIndex: -1,
      editedItem: {
        customerAssignedName: ''
      },
      savingAssignment: false
    }
  },
  computed: {
    ...mapState({
      routers: (state) => state.routers.data,
      loadingRouters: (state) => state.routers.loadingRouters
    })
  },
  mounted() {
    this.getRouters()
  },
  methods: {
    ...mapActions({
      getRouters: 'routers/getRouters',
      updateRouter: 'routers/updateRouter'
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
          await this.updateRouter({
            id: this.editedIndex,
            customerAssignedName: this.editedItem.customerAssignedName
          })

          this.editDialog = false
          this.getRouters()
        } catch (err) {
          console.log(err)
        }

        this.savingAssignment = false
      }
    }
  }
}
</script>