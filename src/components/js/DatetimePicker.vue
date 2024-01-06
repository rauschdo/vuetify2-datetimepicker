<template>
  <v-menu v-model="display"
          :close-on-content-click="false"
          :max-width="dialogWidth"
          :width="dialogWidth"
          bottom
          offset-y
          transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-row>
        <v-col>
          <v-text-field
              v-model="dateTimeStringLocal"
              :clearable="clearable"
              :color="color"
              :dark="dark"
              :disabled="disabled"
              :label="label"
              :loading="loading"
              :readonly="readonly"
              :value="dateTimeStringLocal"
              v-on="on"
          >
            <template v-slot:progress>
              <slot name="progress">
                <v-progress-linear absolute color="primary" height="2" indeterminate></v-progress-linear>
              </slot>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs v-model="activeTab" :color="color" fixed-tabs>
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>mdi-calendar</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer">
            <slot name="timeIcon">
              <v-icon>mdi-clock</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
                v-model="date"
                :color="color"
                :disabled="disableDate"
                full-width
                locale="de-DE"
                scrollable
                @input="showTimePicker"
            ></v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
                ref="timer"
                v-model="time"
                :color="color"
                :disabled="disableTime"
                format="24hr"
                full-width
                landscape
                scrollable
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <slot :parent="this" name="actions">
          <v-btn
              :color="color"
              text
              @click.native="now"
          >
            Echtzeit
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="grey lighten-1"
              text
              @click.native="clearHandler"
          >
            {{ clearText }}
          </v-btn>
          <v-btn
              :color="color"
              text
              @click="okHandler"
          >
            {{ okText }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import {formatDateToString} from "@/utility/dateUtil";

const DISPLAY_FORMAT = 'dd.MM.yyyy - HH:mm'
const DATE = ''
const TIME = '00:00:00'
const DATE_FORMAT = 'yyyy-MM-dd'
const TIME_FORMAT = 'HH:mm'
const DIALOG_WIDTH = 450
const OK_TEXT = 'Apply'
const CLEAR_TEXT = 'Reset'

export default {
  name: 'v-datetime-picker-js',
  model: {
    prop: 'datetime',
    event: 'input'
  },
  props: {
    datetime: {
      type: [Date, Number],
      default: null
    },

    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    },

    //
    dialogWidth: {
      type: Number,
      default: DIALOG_WIDTH
    },
    okText: {
      type: String,
      default: OK_TEXT
    },
    clearText: {
      type: String,
      default: CLEAR_TEXT
    },
    displayFormat: {
      type: String,
      default: DISPLAY_FORMAT
    },

    // Other field styles
    dark: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    },

    // UI influence
    /**
     * Disables date edition in dialog
     */
    disableDate: {
      type: Boolean,
      default: false
    },
    /**
     * Disables time edition in dialog
     */
    disableTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      display: false,
      activeTab: 0,
      date: DATE,
      time: TIME,
      dateTimeStringLocal: ''
    }
  },
  computed: {
    formattedDatetime() {
      return this.selectedDatetime
          ? formatDateToString(this.selectedDatetime, this.displayFormat)
          : ''
    },
    selectedDatetime() {
      if (this.date && this.time) {
        return new Date(`${this.date} ${this.time}`)
      } else {
        return null
      }
    }
  },
  watch: {
    selectedDatetime() {
      this.dateTimeStringLocal = this.formattedDatetime
    },
    menuToggled: {
      immediate: true,
      handler(isShown) {
        if (!isShown) {
          // emit additionally the current calculated value when menu dismisses
          // relevant if user doing selection, then clicking outside the menu
          this.okHandler()
          if (this.$refs.timer) {
            this.$refs.timer.selectingHour = true
          }
        }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // Case: v-model from campaign dialog outside (here prop) is null
      // reset local data which might be set earlier as component
      // is created only once and not again and again
      if (!this.datetime) {
        this.date = DATE
        this.time = TIME
        return
      }

      let initDateTime
      if (this.datetime instanceof Date) {
        initDateTime = this.datetime
      } else if (this.isNumber(this.datetime)) {
        initDateTime = this.datetime
      } else {
        initDateTime = Date.now()
      }
      this.date = formatDateToString(initDateTime, DATE_FORMAT)
      this.time = formatDateToString(initDateTime, TIME_FORMAT)
      this.dateTimeStringLocal = this.formattedDatetime
    },

    okHandler() {
      this.resetPicker()
      this.$emit('input', this.produceEmitMillis())
    },

    clearHandler() {
      this.resetPicker()
      this.date = DATE
      this.time = TIME
      this.$emit('input', null)
    },

    now() {
      const now = Date.now()
      this.date = formatDateToString(now, DATE_FORMAT)
      this.time = formatDateToString(now, TIME_FORMAT)
      this.okHandler()
    },

    resetPicker() {
      this.display = false
      if (this.disableDate) {
        this.activeTab = 1
      } else {
        this.activeTab = 0
      }
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true
      }
    },

    showTimePicker() {
      if (!this.disableTime) {
        this.activeTab = 1
      }
    },

    produceEmitMillis() {
      const date = this.selectedDatetime
      if (date) {
        return date.valueOf()
      } else {
        return null
      }
    },

    isNumber(value) {
      return !isNaN(parseFloat(value)) && !isNaN(Number(value))
    }
  }
}
</script>
