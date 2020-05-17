import * as React from "react";

export const createValueContainer = (initialValue) => {
  const container = { value: initialValue, dispatchers: new Map() };
  container.dispatch = (value) => {
    if (value === container.value) return;
    container.value = value;
    const dispatchers = container.dispatchers.values();
    for (const dispatch of dispatchers) {
      dispatch(value);
    }
  };
  return container;
};

export const useValue = (container) => {
  const ref = React.useRef();
  const [value, dispatch] = React.useState(container.value);
  // When component unmounts, we want to forget it's dispatcher reference.
  React.useEffect(() => () => container.dispatchers.delete(ref), []);
  // We always safe the latest known dispatch reference based on component instance.
  container.dispatchers.set(ref, dispatch);

  return [value, container.dispatch];
};
