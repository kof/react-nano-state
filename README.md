# react-nano-state

Fast state that can be shared across components outside of the React tree.

Fast updates are achieved by letting React reconcile only specific components where you use the value.

Inspired by the idea from [Recoil](https://recoiljs.org/) - state subscriptions (atoms) minus all the rest. Just a state value one can share and have components hook into it without updating the entire subtree.

## Examples

```js
import { createValueContainer, useValue } from "react-nano-state";

// Value container can be exported and reused in any part of the tree.
const valueContainer = createValueContainer("Type something");

const Input = () => {
  // All we need to subscribe to those sharable value changes.
  const [value, setValue] = useValue(valueContainer);
  const onChange = (event) => {
    setValue(event.target.value);
  };
  return <input onChange={onChange} value={value} />;
};
```

[Basic example on codesandbox ](https://codesandbox.io/s/github/kof/react-nano-state/tree/master/examples/basic)

## Installation

You can install and bundle this package using any tool you like. This repo will not add any code to support a particular way of installing or bundling, because it is using a standard ECMAScript and the tools you are using should know how to deal with it.
