import { h, isRef, TransitionGroup } from "vue";
import FieldValidator from "../field-validator/field-validator.component.vue";

export default {
  props: {
    name: { type: String, required: true },
    model: { type: Object, required: true },
    library: { type: Object, required: true },
    transition: { type: Boolean, default: false },
  },
  components: {
    FieldValidator,
  },
  setup(props) {
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
    const normalizedProps = ({ props = {}, models = {} }) => ({
      ...props,
      ...models,
    });
    const toValue = (value) => {
      return isRef(value) ? value.value : value;
    };

    const resolveComponent = (component) => props.library[component] || component;

    const renderValidatedField = (input, index) =>
      h(
        FieldValidator,
        {
          key: index,
          name: input.props.name,
          label: input.props.label,
          validation: input.validation,
          modelValue: input.models.modelValue,
        },
        {
          default: (slotScop) => [
            h(resolveComponent(input.as), {
              ...normalizedEvents(input),
              ...normalizedProps(input),
              ...input.attrs,
              errorMessage: slotScop.errorMessage,
            }),
          ],
        },
      );

    const renderPlainField = (input, index) =>
      h(
        resolveComponent(input.as),
        {
          key: index,
          ...normalizedEvents(input),
          ...normalizedProps(input),
          ...input.attrs,
        },
        input.children && input.children.length ? [...input.children] : [],
      );

    const addRootElement = (component) => h("span", {}, [component]);

    const getFieldsArray = () =>
      Object.values(props.model).map((input, index) => {
        if (!shouldRender(input)) return null;
        const needsRootElement = !!props.transition;

        const fieldComponent =
          input.type === "plain" ? renderPlainField(input, index) : renderValidatedField(input, index);

        return needsRootElement ? addRootElement(fieldComponent) : fieldComponent;
      });

    return () => {
      return h("form", {}, [
        props.transition
          ? h(
              TransitionGroup,
              {
                name: "formGroup",
              },
              getFieldsArray(),
            )
          : getFieldsArray(),
      ]);
    };
  },
};
