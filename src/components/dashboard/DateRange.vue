<template>
  <div>
    <v-dialog
      v-model="menu"
      :close-on-content-click="false"
      width="500"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          v-on="on"
          @click="initOption"
        >
          <v-icon left>mdi-clock</v-icon>
          {{ optionLabel }}
        </v-btn>
      </template>
      <v-card class="pt-4">
        <v-card-text>
          <v-chip-group
            id="date-range-options"
            v-model="locOptionId"
            color="primary"
          >
            <v-row
              v-for="(rowOption, i) in optionGrid"
              :key="i"
              no-gutters
            >
              <v-col
                v-for="(option, j) in rowOption"
                :key="j"
                no-gutters
              >
                <v-chip
                  :value="option.id"
                  filter
                  outlined
                  @click="changeOptionId"
                >
                  {{ option.text }}
                </v-chip>
              </v-col>
            </v-row>
            
          </v-chip-group>
          <v-expand-transition>
            <v-date-picker
              v-if="locOptionId==7"
              v-model="dates"
              range
              class="d-flex justify-content-center mt-3"
            ></v-date-picker>
          </v-expand-transition>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="apply"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
  },
  data () {
    return {
      menu: false,
      locOptionId: this.optionId,
      dates: ['', '']
    }
  },
  computed: {
    ...mapState('bytesUsage', ['optionId', 'dateOptions', 'timeTo', 'timeFrom']),

    optionLabel() {
      const option = this.dateOptions.find((option) => option.id === this.optionId)

      return option ? option.text : ''
    },
    optionGrid() {
      const res = []
      let i,temparray
      const chunk = 2

      for (i = 0; i < this.dateOptions.length; i += chunk) {
        temparray = this.dateOptions.slice(i, i + chunk)
        res.push(temparray)
      }

      return res
    }
  },
  methods: {
    ...mapActions({
      setOptionId: 'bytesUsage/setOptionId',
      setTimeFrom: 'bytesUsage/setTimeFrom',
      setTimeTo: 'bytesUsage/setTimeTo'
    }),
    changeOptionId() {
      // console.log(this.locOptionId)
      // this.setOptionId(this.locOptionId)
    },
    dlgBtnClicked() {
      this.$emit('close')
    },
    apply() {
      this.setOptionId(this.locOptionId)
      let timeTo = null
      let timeFrom = null
      
      if (this.locOptionId === 7) { // custome range
        timeTo = new Date(this.dates[1])
        timeFrom = new Date(this.dates[0])
        if (timeTo < timeFrom) {
          const tmp = timeTo

          timeTo = timeFrom
          timeFrom = tmp
        }
      }
      else {
        const option = this.dateOptions.find((option) => option.id === this.locOptionId)
        const dt = option ? option.value : 0

        timeTo = new Date()
        timeFrom = new Date()
        timeFrom.setHours( timeFrom.getHours() - dt )
      }
      this.setTimeTo(timeTo)
      this.setTimeFrom(timeFrom)
      this.$emit('submit', { timeTo, timeFrom })
      this.menu = false
    },
    initOption() {
      this.locOptionId = this.optionId
      if (this.timeFrom !== null) {
        this.dates[0] = this.timeFrom.toISOString().slice(0,10)
        this.dates[1] = this.timeTo.toISOString().slice(0,10)
      }
    }
  }
}
</script>
<style>
  #date-range-options .v-slide-group__content {
    display: flex;
    flex-direction: column;
  }
</style>