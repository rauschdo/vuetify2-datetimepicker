# Vuetify2-Datetimepicker

DatetimePicker component for Vuetify.js combining Datepicker and Timepicker in one interaction flow.<br>
This is an adaptation and extension of the Component
from <b>[Darren Fang](https://github.com/darrenfang/vuetify-datetime-picker)</b>
<br>
<br>
The Component uses Typescript Syntax in its script-block.<br>
For js see
in [js-subpackage](https://github.com/rauschdo/vuetify2-datetimepicker/blob/master/src/components/js/DatetimePicker.vue)
<br>
<br>
❗<b>NOTE:</b> A Version of this Component compatible with <b>Vue(tify) 3.x</b>
can [be found here](https://github.com/rauschdo/vuetify3-datetimepicker)

---

## 🛠️ Usage

```html
<v-datetime-picker label="Select Datetime" v-model="datetime"></v-datetime-picker>
<v-datetime-picker-js label="Select Datetime" v-model="datetime"></v-datetime-picker-js>
```

### Properties

| Name             | Type                                   | Default Value      | Description                                        |
|------------------|----------------------------------------|--------------------|----------------------------------------------------|
| datetime (model) | ❗Date/Number (Date/String in Original) |                    | Time picker model.                                 |
| disabled         | Boolean                                | false              | Input is disabled.                                 |
| clearable        | Boolean                                | false              | Show icon to clear the input.                      |
| loading          | Boolean                                | false              | Input is loading.                                  |
| readonly         | Boolean                                | true               | Input is readonly.                                 |
| label            | string                                 |                    | Sets input label.                                  |
| dialogWidth      | Number                                 | 340                | The width of the dialog.                           |
| okText           | string                                 | Apply              | Sets the text of the ok button.                    |
| clearText        | string                                 | Reset              | Sets the text of the clear button.                 |
| displayFormat    | string                                 | dd.MM.yyyy - HH:mm | Format to be displayed and evaluated in Textfield. |
| dark             | Boolean                                | false              | Disables the calendar tab.                         |
| color            | string                                 | primary            | Color used for Date display and Buttons.           |
| disableDate      | Boolean                                | false              | Disables the calendar component.                   |
| disableTime      | Boolean                                | false              | Disables the timepicker component.                 |

### Constants

- DATE_FORMAT - yyyy-MM-dd
- TIME_FORMAT - HH:mm:ss

### Events

| Name  | Arguments           | Description             |
|-------|---------------------|-------------------------|
| input | value (Date/Number) | The updated bound model |

---

## ☄️ Project Setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

---

## 🔑 License

[MIT](https://github.com/rauschdo/vuetify2-datetimepicker/blob/master/LICENSE)