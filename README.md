# Nano State - sharable state for React

Fast state that can be shared across components outside of the React tree.

Fast updates are achieved by letting React reconcile only specific components where you use the value.

Inspired by the idea from [Recoil](https://recoiljs.org/) - state subscriptions (atoms) minus all the rest. Just a state value one can share and have components hook into it without updating the entire subtree.

## Examples

```js
import { createValueContainer, useValue } from "react-nano-state";

// Value container can be exported and reused in any part of the tree.
const searchContainer = createValueContainer("Type the search");

const SearchInput = () => {
  // All we need to subscribe to those sharable value changes.
  const [search, setSearch] = useValue(searchContainer);
  const onChange = (event) => {
    setSearch(event.target.value);
  };
  return <input onChange={onChange} value={value} />;
};
```

[Basic example on codesandbox ](https://codesandbox.io/s/github/kof/react-nano-state/tree/master/examples/basic)

## API

### Value container

A value container is an object that can be shared across the code base and used to subscribe to the value.

```js
// value-containers.js
import { createValueContainer } from "react-nano-state";
export const searchContainer = createValueContainer(initialValue);
```

### Hook into the value

It is very similar to React's `useState` with the difference that you access a shared state.

```js
import { useValue } from "react-nano-state";
import { searchContainer } from "./value-containers";

const SearchInput = () => {
  const [search, setSearch] = useValue(searchContainer);
  const onChange = (event) => {
    setSearch(event.target.value);
  };
  return <input onChange={onChange} value={search} />;
};
```

### Update value from outside

You can update the value outside of React components and components using it will receive the update.

```js
// value-containers.js
import { searchContainer } from "./value-containers";
searchContainer.dispatch(newSearch);
```

### Values container

A values container is an object that can be shared across the code base and used to subscribe to values by key.

```js
// values-containers.js
import { createValuesContainer } from "react-nano-state";
export const myValuesContainer = createValueContainer();
```

### Initialize the values

#### Initialize by Object

You can initialize list of values by providing an Object. The key:value properties found directly in the object will be used to generate `valueContainer` objects.

```js
// values-containers.js
import { createValuesContainer } from "react-nano-state";
export const myValuesContainer = createValueContainer({
  value1: "initial value",
  value2: "another value",
  // no value3 was declared jere
});
```

#### Initialize by Array

You can initialize list of values by providing an Array that contains Two-dimensional Arrays. The first item from the two-dimensional array will be used as key, the second one as value to generate `valueContainer` objects.

```js
// values-containers.js
import { createValuesContainer } from "react-nano-state";
export const myValuesContainer = createValueContainer([
  ["value1", "initial value"],
  ["value2", "another value"],
  // no value3 was declared jere
]);
```

#### Initialize with the hook

The variable will be initialized with the provided value **only** if it doesn't exist in the container.

```js
import { useValues } from "react-nano-state";
import { myValuesContainer } from "./values-containers";

const ReactComponent = (props) => {
  const [value3, setValue3] = useValues(
    myValuesContainer,
    "value3",
    "the initial value"
  );
};
```

### Hook into a specific value by key

It is very similar to React's `useState` with the difference that you access a shared state.

```js
import { useValues } from "react-nano-state";
import { myValuesContainer } from "./values-containers";

const handleValue3Change = event => {
  myValuesContainer.dispatch("value3", event.target.value);
}

const SearchInput = () => {
  const [value1, setValue1] = useValues(myValuesContainer, 'value1'); // no initial value provided
  // The initial value will be ignored because value2 was initialized up in our values-containers.js script
  const [value2, setValue2] = useValues(myValuesContainer, 'value2', 'this value will be ignored');
  const [value3, setValue3] = useValues(myValuesContainer, 'value3', 'this is the initial value of the new value3');
  const onChange = (event) => {
    setValue1(event.target.value);
  };
  return <div>
    <label>value1</label> <input onChange={onChange} value={value1} /><br/>
    <label>value2</label> <input onChange={event =>setValue2(event.target.value)} value={value2} /><br/>
    <label>value3</label> <input onChange={handleValue3Change} value={value3} /><br/>
};
```

### Update value from outside

You can update the value outside of React components and components using it will receive the update.

```js
import { myValuesContainer } from "./value-containers";
myValuesContainer.dispatch("value3", event.target.value);
```

## Installation

You can install and bundle this package using any tool you like. This repo will not add any code to support a particular way of installing or bundling, because it is using a standard ECMAScript and the tools you are using should know how to deal with it.
