<template>
  <v-menu
      v-model="display"
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

<script lang="ts">
import Vue from "vue";
import {Component, Model, Prop, Watch} from "vue-property-decorator";
import {formatDateToString} from "@/utility/dateUtil";

const DEFAULTS = {
  DISPLAY_FORMAT: 'dd.MM.yyyy - HH:mm',

  DATE: '',
  TIME: '00:00:00',
  DATE_FORMAT: 'yyyy-MM-dd',
  TIME_FORMAT: 'HH:mm',
  DIALOG_WIDTH: 450,
  OK_TEXT: 'Apply',
  CLEAR_TEXT: 'Reset',
};

@Component({
  name: 'v-datetime-picker'
})
export default class DatetimePicker extends Vue {
  @Model('input', {type: [Date, Number]}) readonly datetime!: Date | number;

  @Prop({type: Boolean, default: false}) readonly disabled!: boolean;
  @Prop({type: Boolean, default: false}) readonly clearable!: boolean;
  @Prop({type: Boolean, default: false}) readonly loading!: boolean;
  @Prop({type: Boolean, default: true}) readonly readonly!: boolean;
  @Prop({type: String, default: ''}) readonly label!: string;

  @Prop({type: Number, default: DEFAULTS.DIALOG_WIDTH}) readonly dialogWidth!: number;
  @Prop({type: String, default: DEFAULTS.OK_TEXT}) readonly okText!: string;
  @Prop({type: String, default: DEFAULTS.CLEAR_TEXT}) readonly clearText!: string;
  @Prop({type: String, default: DEFAULTS.DISPLAY_FORMAT}) readonly displayFormat!: string;

  // Other field styles
  @Prop({type: Boolean, default: false}) readonly dark!: boolean;
  @Prop({type: String, default: 'primary'}) readonly color!: boolean;

  // UI influence
  /**
   * Disables date edition in dialog
   */
  @Prop({type: Boolean, default: false}) readonly disableDate!: boolean;
  /**
   * Disables time edition in dialog
   */
  @Prop({type: Boolean, default: false}) readonly disableTime!: boolean;

  display = false;
  activeTab = 0
  date = DEFAULTS.DATE
  time = DEFAULTS.TIME

  dateTimeStringLocal = ''

  // Computed
  get formattedDatetime(): string {
    return this.selectedDatetime
        ? formatDateToString(this.selectedDatetime, this.displayFormat)
        : ''
  }

  get selectedDatetime(): Date | null {
    if (this.date && this.time) {
      return new Date(`${this.date} ${this.time}`)
    } else {
      return null
    }
  }

  // Watcher
  @Watch('selectedDatetime', {immediate: true})
  dateTimeChanged() {
    this.dateTimeStringLocal = this.formattedDatetime
  }

  @Watch('display')
  menuToggled(isShown: boolean) {
    if (!isShown) {
      // emit additionally the current calculated value when menu dismisses
      // relevant if user doing selection, then clicking outside the menu
      this.okHandler()
      if (this.$refs.timer) {
        (this.$refs.timer as Record<string, any>).selectingHour = true
      }
    }
  }

  // Lifecycle
  created() {
    this.init()
  }

  // Methods
  init() {
    // Case: v-model from campaign dialog outside (here prop) is null
    // reset local data which might be set earlier as component
    // is created only once and not again and again
    if (!this.datetime) {
      this.date = DEFAULTS.DATE
      this.time = DEFAULTS.TIME
      return
    }

    let initDateTime: Date | number
    if (this.datetime instanceof Date) {
      initDateTime = this.datetime
    } else if (this.isNumber(this.datetime)) {
      initDateTime = this.datetime
    } else {
      initDateTime = Date.now()
    }
    this.date = formatDateToString(initDateTime, DEFAULTS.DATE_FORMAT)
    this.time = formatDateToString(initDateTime, DEFAULTS.TIME_FORMAT)
    this.dateTimeStringLocal = this.formattedDatetime
  }

  okHandler() {
    this.resetPicker()
    this.$emit('input', this.produceEmitMillis())
  }

  clearHandler() {
    this.resetPicker()
    this.date = DEFAULTS.DATE
    this.time = DEFAULTS.TIME
    this.$emit('input', null)
  }

  now() {
    const now = Date.now()
    this.date = formatDateToString(now, DEFAULTS.DATE_FORMAT)
    this.time = formatDateToString(now, DEFAULTS.TIME_FORMAT)
    this.okHandler()
  }

  resetPicker() {
    this.display = false
    if (this.disableDate) {
      this.activeTab = 1
    } else {
      this.activeTab = 0
    }
    if (this.$refs.timer) {
      (this.$refs.timer as Record<string, any>).selectingHour = true
    }
  }

  showTimePicker() {
    if (!this.disableTime) {
      this.activeTab = 1
    }
  }

  produceEmitMillis(): number | null {
    const date = this.selectedDatetime
    if (date) {
      return date.valueOf()
    } else {
      return null
    }
  }

  isNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && !isNaN(Number(value))
  }
}
</script>
