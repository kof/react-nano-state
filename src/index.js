import * as React from "react";

const dispatchersMap = new Map();

export const createValueContainer = (initialValue) => {
  const container = { value: initialValue, dispatchersMap };
  container.setValue = (value) => {
    if (value === container.value) return;
    container.value = value;
    const dispatchers = dispatchersMap.values();
    for (const dispatcher of dispatchers) {
      dispatcher();
    }
  };
  return container;
};

const flip = (sw) => !sw;

export const useValue = (container) => {
  const ref = React.useRef();
  // A workaround to trigger force update using hooks.
  const [_, dispatch] = React.useReducer(flip, false);
  // When component unmounts, we want to forget it's dispatcher reference.
  React.useEffect(() => () => container.dispatchersMap.delete(ref), []);
  // We always safe the latest known dispatch reference based on component instance.
  container.dispatchersMap.set(ref, dispatch);

  return [container.value, container.setValue];
};
