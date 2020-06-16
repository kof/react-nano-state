import * as React from "react";

/**
 * Create value container
 * @param {*} [initialValue]
 * @returns {{value: *, dispatch:function(*)}} valuesContainer
 */
export const createValueContainer = (initialValue) => {
  const container = { value: initialValue, dispatchers: new Map() };
  container.dispatch = (value) => {
    if (value === container.value) return;
    container.value = value;
    const dispatchers = container.dispatchers.keys();
    // Just in case concurrent React didn't run `useEffect` cleanup,
    // we forget potentially paused components.
    // They will be re-registered as soon as component updates.
    container.dispatchers = new Map();
    for (const dispatch of dispatchers) {
      dispatch(value);
    }
  };
  return container;
};

/**
 * React Hook for using value
 * @returns {[*, function()]}  a stateful value, and a function to update it
 */
export const useValue = (container) => {
  const [value, dispatch] = React.useState(container.value);
  React.useDebugValue("Nano State");
  React.useEffect(() => {
    // In case concurrent React delays the effect and another
    // component dispatches an update in the meantime.
    if (value !== container.value) {
      dispatch(container.value);
    }
    // Safe the latest known dispatch reference inside of an effect
    // to make sure component has fully rendered before we "subscribe".
    container.dispatchers.set(dispatch);
    // When component "unmounts", we want to forget it's dispatcher reference.
    // This will also happen upon updates before the effect,
    // but that's ok, this op is cheap.
    return () => container.dispatchers.delete(dispatch);
  });
  return [value, container.dispatch];
};

/**
 * Create multiple values container
 * @param {string|undefined|Object.<*,*>} [initialEntries]
 * @param {boolean} [strict=false] when false the container will create valueContainer on useValues usage if the key doesn't exist
 * @returns {{values: Map, strict:bool, dispatch:function(*, *)}} valuesContainer
 */
export const createValuesContainer = (
  initialEntries = undefined,
  strict = false
) => {
  const valuesContainer = { values: new Map(), strict };
  valuesContainer.dispatch = (key, value) => {
    const container = valuesContainer.values.get(key);
    container.dispatch(value);
  };

  if (Array.isArray(initialEntries)) {
    // initialEntires is Array of Two-dimensional arrays of key and value pairs
    // example: [['key1', 'value1'], ['key2', 'value2']]
    initialEntries.forEach(([key, initialValue]) =>
      valuesContainer.values.set(key, createValueContainer(initialValue))
    );
  } else if (initialEntries) {
    // initialEntires is Object of key:value pairs
    // example: {key1:value1, key2, value2}
    Object.entries(initialEntries).forEach(([key, initialValue]) =>
      valuesContainer.values.set(key, createValueContainer(initialValue))
    );
  }

  return valuesContainer;
};

/**
 * React Hook for using values via provided key
 * @param {{values: Map, strict:bool, dispatch:function(Object, Object}} valuesContainer
 * @param {*} key the key for the stored value
 * @param {*} [initialValue] if the container is not initialized, this value will be used as an initial one
 * @returns {[*, function()]}  a stateful value, and a function to update it
 */
export function useValues(valuesContainer, key, initialValue) {
  let container = valuesContainer.values.get(key);
  if (!container && !valuesContainer.strict) {
    container = createValueContainer(initialValue);
    valuesContainer.values.set(key, container);
  }
  return useValue(container);
}
