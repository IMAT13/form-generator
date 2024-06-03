//For more information look it up :https://gitlab.partdp.ir/farashenasa/Authentication/client/auth-web/-/issues/404
import FormGenerator from "../components/form-generator/form-generator.component.vue";
import useReactiveComputed from "../composables/useReactiveComputed";
import { h, reactive, onUnmounted } from "vue";
import { useForm } from "vee-validate";

export default {
  install(app, library) {
    const DEFAULT_FORM_NAME = "form";
    const contexts = reactive({});
    app.component("InfraFormGenerator", {
      props: {
        name: {
          type: String,
          required: false,
          default: DEFAULT_FORM_NAME,
        },
      },
      setup(props) {
        contexts[props.name] = useForm();
        const clearContext = () => {
          contexts[props.name] = null;
        };
        onUnmounted(() => clearContext);
        return () =>
          h(FormGenerator, {
            ...props,
            library,
          });
      },
    });

    app.provide("useFormContext", (name = DEFAULT_FORM_NAME) => {
      return useReactiveComputed(() => contexts[name]);
    });
  },
};