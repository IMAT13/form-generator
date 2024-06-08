<template>
  <fieldComponent v-bind="props.input.props" v-model="fieldValue" :errorMessage="errorMessage">
    {{ props.input.children() }}
  </fieldComponent>
</template>

<script setup>
  import { watch, onMounted, computed } from "vue";
  import { useField } from "vee-validate";

  defineOptions({
    name: "FiledValidatorComponent",
  });
  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    validation: {
      type: Object,
      default: () => {},
      //TODO add validator if needed
    },
    input: {
      type: Object,
      required: true,
    },
  });
  const modelValue = defineModel();

  const fieldComponent = computed(() => props.input.component);

  //TODO use toRef
  const validationProps = computed(() => props.validation);
  const fieldOptions = {
    label: props.label,
    initialValue: modelValue.value,
    standalone: validationProps.value.standalone,
    syncVModel: true,
    // validateOnMount: validationProps.value.mode === "aggressive",
    //TODO try to make it work without an extra watch (look at the core functionality of the useField in relation to rule changes,
    //there were an interaction mode previously and they replaced it with silent mode search about it)
  };

  const fieldValue = computed({
    get() {
      return modelValue.value;
    },
    set(value) {
      validationValue.value = value;
      modelValue.value = value;
    },
  });

  const {
    errorMessage,
    //   meta,
    validate,
    value: validationValue,
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
</script>
