<template>
  <v-app>
    <v-main>
      <v-container>
        <v-datetime-picker v-model="datetime1" label="[Picker ts] Select Datetime"></v-datetime-picker>
        <v-datetime-picker-js v-model="datetime2" label="[Picker js] Select Datetime"></v-datetime-picker-js>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from "vue-property-decorator";
import VDatetimePicker from "@/components/DatetimePicker.vue";
import VDatetimePickerJs from "@/components/js/DatetimePicker.vue";

@Component({
  components: {
    VDatetimePicker,
    VDatetimePickerJs,
  }
})
export default class App extends Vue {
  datetime1 = null
  datetime2 = null
}
</script>
