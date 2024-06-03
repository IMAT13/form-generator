import { reactive, isRef, unref, computed } from "vue";

const toReactive = (objectRef) => {
  if (!isRef(objectRef)) return reactive(objectRef);

  const proxy = new Proxy(
    {},
    {
      get(_, p, receiver) {
        const value = objectRef.value;
        if (value && typeof value === "object") {
          return unref(Reflect.get(value, p, receiver));
        }
        return undefined;
      },
      set(_, p, value) {
        if (objectRef.value && typeof objectRef.value === "object") {
          if (isRef(objectRef.value[p]) && !isRef(value)) objectRef.value[p].value = value;
          else objectRef.value[p] = value;
          return true;
        }
        return false;
      },
      deleteProperty(_, p) {
        if (objectRef.value && typeof objectRef.value === "object") {
          return Reflect.deleteProperty(objectRef.value, p);
        }
        return false;
      },
      has(_, p) {
        if (objectRef.value && typeof objectRef.value === "object") {
          return Reflect.has(objectRef.value, p);
        }
        return false;
      },
      ownKeys() {
        if (objectRef.value && typeof objectRef.value === "object") {
          return Object.keys(objectRef.value);
        }
        return [];
      },
      getOwnPropertyDescriptor() {
        return {
          enumerable: true,
          configurable: true,
        };
      },
    },
  );

  return reactive(proxy);
};

const useReactiveComputed = (getter) => {
  return toReactive(computed(getter));
};

export default useReactiveComputed;
