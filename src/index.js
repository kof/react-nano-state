import * as React from "react";

export const createValueContainer = (initialValue) => ({
  value: initialValue,
  dispatchers: new Map(),
});

const flip = (sw) => !sw;

export const useValue = (container) => {
  const ref = React.useRef();
  // A workaround to trigger foce update using hooks.
  const [_, dispatch] = React.useReducer(flip, false);
  // When component unmounts, we want to forget it's dispatcher reference.
  React.useEffect(() => () => container.dispatchers.delete(ref), []);
  // We always safe the latest known dispatch reference based on component instance.
  container.dispatchers.set(ref, dispatch);
  const setValue = (value) => {
    if (value === container.value) return;
    container.value = value;
    const dispatchers = container.dispatchers.values();
    for (const dispatcher of dispatchers) {
      dispatcher();
    }
  };
  return [container.value, setValue];
};
