import * as React from "react";

const dispatchersMap = new Map();

export const createValueContainer = (initialValue) => {
  const container = { value: initialValue, dispatchersMap };
  container.dispatch = (value) => {
    if (value === container.value) return;
    container.value = value;
    const dispatchers = dispatchersMap.values();
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
  React.useEffect(() => () => container.dispatchersMap.delete(ref), []);
  // We always safe the latest known dispatch reference based on component instance.
  container.dispatchersMap.set(ref, dispatch);

  return [value, container.dispatch];
};
