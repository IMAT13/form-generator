
# FormGenerator Vue Plugin

FormGenerator is a Vue plugin that simplifies the creation and management of forms in your Vue.js applications. It dynamically generates form fields based on a schema and provides built-in validation and event handling.

## Features

- Dynamic form generation from a schema.
- Integration with `vee-validate` for form validation.
- Support for custom components and events.
- Reactive form state management.

## Installation

Currently, FormGenerator is not available as an npm package. However, you can use the provided codebase and add it to your project.

## Usage

### Add FormGenerator to app Config

First, import FormGenerator and use it as a plugin in your Vue application.

```javascript
import { createApp } from 'vue';

import library from './path-to-library';
import FormGenerator from 'path-to-form-generator';

const app = createApp(App);

app.use(FormGenerator, library);

app.mount('#app');
```

### Schema Definition

Define a schema to generate your form fields. Here is an example schema for a login form:

```javascript
import { reactive, ref } from 'vue';

const loginSchema = reactive({
  username: {
    as: "text-field",
    models: {
      modelValue: ref(""),
    },
    attrs:{
        // list of attributes for your input
    },
    props: {
      label: "Username",
      name: "username",
      placeholder: "Enter your username",
    },
    validation: {
      standalone: false,
      rules: {
        required: true,
      },
    },
  },
  password: {
    as: "text-field",
    models: {
      modelValue: ref(""),
    },
    props: {
      type: "password",
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
    },
    validation: {
      standalone: false,
      rules: {
        required: true,
        max: 8,
        min: 8,
      },
    },
  },
  submit: {
    type: "plain",// it means just render it without validation
    as: "custom-button",
    children: ["Submit"],
    props: {
      type: "button",
    },
    events: {
      onClick: login,
    },
  },
});
```

### Customization and Styling

FormGenerator allows you to customize the components and styles using a library of components. Define your components in the library:

```javascript
import { defineAsyncComponent, markRaw } from "vue";

export default {
  "text-field": markRaw(
    defineAsyncComponent(() => import(`../../components/shared/text-field.component.vue`)),
  ),
  "custom-button": markRaw(
    defineAsyncComponent(() => import(`../../components/shared/custom-button.component.vue`)),
  ),
  // ...
};
```

### Validation

FormGenerator integrates with `vee-validate` to provide robust validation capabilities. Define validation rules in the schema:

```javascript
validation: {
  standalone: false,
  /* mode:"aggersive" its used when you want to validate the field aggesively when anything about the field changes, like value, rules and ...*/
  rules: {
    required: true,
  },
},
```

### Event Handling

Custom events can be defined and handled within the schema:

```javascript
events: {
  onClick: login,
},
```

### Compatibility

FormGenerator is fully compatible with Vue.js. There are no known issues so far.

### Contributing

We welcome contributions from the community! If you encounter any issues or have feature requests, please create an issue in the repository.

### License

FormGenerator is distributed under the MIT License.

Feel free to reach out if you have any questions or need further assistance.
