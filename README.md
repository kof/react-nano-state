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
// nano-containers.js
import { createValueContainer } from "react-nano-state";
export const searchContainer = createValueContainer(initialValue);
```

### Hook into the value

It is very similar to React's `useState` with the difference that you access a shared state.

```js
import { useValue } from "react-nano-state";
import { searchContainer } from "./nano-containers";

const SearchInput = () => {
  const [search, setSearch] = useValue(searchContainer);
  const onChange = (event) => {
    setSearch(event.target.value);
  };
  return <input onChange={onChange} value={search} />;
};
```

### Update value outside of component

You can update the value outside of React components and components using it will receive the update.

```js
import { searchContainer } from "./nano-containers";
searchContainer.dispatch(newSearch);
```

### Subscribe value outside of component

You can subscribe to the value outside of React components.

```js
import { searchContainer } from "./nano-containers";
searchContainer.subscribe(console.log);
```
