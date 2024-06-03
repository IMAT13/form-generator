import { watch, onMounted, computed, h } from "vue";
import { useField } from "vee-validate";

export default {
  name: "FiledValidatorComponent",
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      required: true,
    },
    validation: {
      type: Object,
      default: () => {},
      //TODO add validator if needed
    },
  },
  setup(props, { slots }) {
    //TODO use toRef
    const validationProps = computed(() => props.validation);
    const fieldOptions = {
      label: props.label,
      initialValue: props.modelValue,
      standalone: validationProps.value.standalone,
      syncVModel: true,
      // validateOnMount: validationProps.value.mode === "aggressive",
      //TODO try to make it work without an extra watch (look at the core functionality of the useField in relation to rule changes,
      //there were an interaction mode previously and they replaced it with silent mode search about it)
    };
    const {
      errorMessage,
      //   meta,
      validate,
    } = useField(props.name, validationProps.value.rules, fieldOptions);
    //TODO maybe using watchEffect is a better approach
    const watchRules = async (rules) => {
      watch(
        () => rules,
        async () => {
          await validate();
        },
        { immediate: true, deep: true },
      );
    };
    onMounted(() => {
      if (validationProps.value.mode === "aggressive") watchRules(validationProps.value.rules);
    });

    return () => slots.default({ errorMessage: errorMessage.value });

    // this component should provide errorMessage using slot scop , and not render any extra DOM element
    // but because of the very edge case usage of this inside a transition group ,this component needs to have a root
    // to ensure that every child element inside of the transition group have a root inside form generator
  },
};
