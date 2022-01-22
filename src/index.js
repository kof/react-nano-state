const React = require("react");

exports.createValueContainer = (initialValue) => {
  const container = {};
  container.value = initialValue;
  container.dispatchers = new Map();
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

exports.useValue = (container) => {
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
