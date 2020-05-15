import * as React from "react";
import ReactDOM from "react-dom";
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

const CurrentValue = () => {
  const [value] = useValue(valueContainer);
  return <p>Current value: {value}</p>;
};

const App = () => {
  const [inputsAmount, setInputsAmount] = React.useState(2);

  return (
    <React.Fragment>
      <p>
        Make sure you reload codesandbox after any changes, hot reload doesn't
        work in this case.
      </p>
      <p>
        {new Array(inputsAmount).fill(0).map((_, index) => (
          <Input key={index} />
        ))}
      </p>
      <CurrentValue />
      <button
        onClick={() => {
          setInputsAmount(inputsAmount + 1);
        }}
      >
        Add input
      </button>
      <button
        onClick={() => {
          setInputsAmount(inputsAmount - 1);
        }}
      >
        Remove input
      </button>
    </React.Fragment>
  );
};

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement("div"))
);
