# FormGenerator Vue Plugin

FormGenerator is a Vue plugin that simplifies the creation and management of forms in your Vue.js applications. It dynamically generates form fields based on a schema and provides advanced validation, transition effects, and flexible component integration.

## Features ✨

- **Dual Field Types**
  - Validated Fields (vee-validate integration)
  - Plain Elements (no validation)
- **Dynamic Children Rendering**
- **Component Transition Animations**
- **Aggressive & Lazy Validation Modes**
- **Scoped Style Integration**
- **Custom Component Library Support**
- **Reactive Schema Configuration**

## Installation & Setup

### Plugin Registration

```javascript
import { createApp } from "vue";

import library from "./path-to-library";
import FormGenerator from "path-to-form-generator";

const app = createApp(App);

app.use(FormGenerator, library);

app.mount("#app");
```

### Component Library Example

```javascript
import { markRaw } from "vue";
import TextField from "./components/TextField.vue";
import CustomButton from "./components/CustomButton.vue";

export default {
  "text-field": markRaw(TextField),
  "custom-button": markRaw(CustomButton),
  "date-picker": markRaw(defineAsyncComponent(() => import("./components/DatePicker.vue"))),
};
```

## Schema Definition Guide 🗂️

### Basic Structure

```javascript
const formSchema = reactive({
  fieldName: {
    type: "validated" | "plain", // Optional (default: 'validated')
    as: "component-name",
    models: {
      /* v-model mappings */
    },
    props: {
      /* component props */
    },
    attrs: {
      /* HTML attributes */
    },
    events: {
      /* event handlers */
    },
    children: [
      /* child elements */
    ],
    validation: {
      /* validation rules */
    },
    allowRender: true, // Conditional rendering
  },
});
```

### Full Featured Example

Define a schema to generate your form fields. Here is an example schema for a login form:

```javascript
const userSchema = reactive({
  username: {
    as: "text-field",
    models: {
      modelValue: ref(""), // Required for v-model
      otherModel: ref(null), // Additional models
    },
    props: {
      label: "Username",
      name: "username",
      placeholder: "Enter username",
    },
    attrs: {
      "data-testid": "username-field",
    },
    events: {
      onBlur: handleBlur,
    },
    validation: {
      rules: {
        required: true,
        min: 3,
        validator: (value) => value.includes("@"),
      },
      mode: "aggressive", // or undefined for lazy
      standalone: false,
    },
    allowRender: computed(() => featureFlags.enableUsername),
  },

  bio: {
    type: "plain",
    as: "rich-text-editor",
    models: {
      content: ref(""),
    },
    children: [
      h("div", { class: "toolbar" }, [
        /* toolbar buttons */
      ]),
    ],
  },

  submit: {
    type: "plain",
    as: "custom-button",
    children: [h("span", { class: "icon" }, "📨"), " Submit Form"],
    events: {
      onClick: submitForm,
    },
  },
});
```

## Key Features 🔍

### 1. Component Resolution

```javascript
// Direct component reference
as: MyComponent;

// Library lookup
as: "text-field"; // Resolves to library['text-field']

// HTML tags
as: "div";
```

### 2. Plain Elements

```javascript
{
  type: 'plain',
  as: 'custom-component',
  children: [
    'Button Text',
    h(Icon, { name: 'check' })
  ]
}
```

- Renders without validation wrapper
- Supports direct children's injection
- Full event/prop passthrough

### 3. Children Rendering

```javascript
// String children
children: ["Simple Text Content"];

// VNode children
children: [h("div", { class: "wrapper" }, [h(Icon, { name: "user" })])];

// Component Slot Syntax
h(
  MyComponent,
  {},
  {
    default: () => [
      /* slot content */
    ],
    footer: () => h("div", "Custom Footer"),
  },
);
```

### 4. Validation

FormGenerator integrates with `vee-validate` to provide robust validation capabilities. Define validation rules in the schema:

```javascript
validation: {
  standalone: false, // Connect to parent form
  /* mode:"aggressive" its used when you want to validate the field aggressively when anything about the field changes, like value, rules and ...*/
  rules: {
    required: true,
    email: true,
    custom: (value) => value === 'secret'
  },
},
```

- Reactive rule updates

- Cross-field validation support

- Error message templating

- Custom validation events

### 5. Event Handling

events can be defined and handled within the schema:

```javascript
events: {
  onClick: login,
},
```

### Compatibility

FormGenerator is fully compatible with Vue.js. There are no known issues so far.

### Contributing

We welcome contributions from the community! If you encounter any issues or have feature requests.

### License

Feel free to reach out to me if you have any questions or need any more help.
