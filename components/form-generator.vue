<template>
  <formComponent />
</template>

<script setup>
  import { h, isRef, TransitionGroup } from "vue";
  import ValidatedFieldRenderer from "./validated-field-renderer.vue";

  const props = defineProps({
    name: { type: String, required: true },
    model: { type: Object, required: true },
    library: { type: Object, required: true },
    transition: { type: Boolean, default: true },
  });

  const shouldRender = (input) => {
    if ("allowRender" in input) return toValue(input.allowRender);
    else return true;
  };

  const normalizedEvents = ({ models = {}, events = {} }) => ({
    ...Object.keys(models).reduce((result, key) => {
      result[`onUpdate:${key}`] = (newValue) => (models[key] = newValue);
      return result;
    }, {}),
    ...events,
  });
  const normalizedProps = ({ props = {}, models = {}, attrs = {} }) => ({
    ...props,
    ...models,
    ...attrs,
  });

  const toValue = (value) => {
    return isRef(value) ? value.value : value;
  };

  const resolveComponent = (component) => props.library[component] || component;
  const resolveChildren = (input) => (input.children && input.children.length ? [...input.children] : []);

  const renderValidatedField = (input, index) =>
    h(ValidatedFieldRenderer, {
      key: index,
      name: input.props.name,
      label: input.props.label,
      validation: input.validation,
      modelValue: input.models.modelValue,
      "onUpdate:modelValue": (newValue) => (input.models.modelValue = newValue),
      input: {
        component: resolveComponent(input.as),
        props: {
          ...normalizedEvents(input),
          ...normalizedProps(input),
        },
        children: resolveChildren(input),
      },
    });

  const renderPlainField = (input, index) =>
    h(
      resolveComponent(input.as),
      {
        key: index,
        ...normalizedEvents(input),
        ...normalizedProps(input),
      },
      () => resolveChildren(input),
    );

  const getFieldsArray = () =>
    Object.values(props.model).map((input, index) => {
      if (!shouldRender(input)) return null;

      return input.type === "plain" ? renderPlainField(input, index) : renderValidatedField(input, index);
    });

  const formComponent = h(
    "form",
    props.transition
      ? h(
          TransitionGroup,
          {
            name: "formGroup",
          },
          getFieldsArray,
        )
      : getFieldsArray,
  );
</script>

<style lang="scss" scoped>
  .formGroup-move,
  .formGroup-enter-active {
    transition: all 0.5s ease;
  }

  .formGroup-enter-from,
  .formGroup-leave-to {
    opacity: 0;
  }

  .formGroup-leave-active {
    opacity: 0;
    position: absolute;
  }
</style>
