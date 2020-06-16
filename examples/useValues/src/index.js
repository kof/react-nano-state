import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createValuesContainer, useValues } from "react-nano-state";

// Value container can be exported and reused in any part of the tree.
const countersValuesContainer = createValuesContainer();
const initWithObjectValuesContainer = createValuesContainer({
  key1: 1,
  key2: 2,
});
const initWithArrayValuesContainer = createValuesContainer([
  ["keyX", { foo: "bar" }],
  [1, new Date()],
]);

const emptyValuesContainer = createValuesContainer();

const clearValue = () => {
  countersValuesContainer.dispatch("counter1", 0);
};

function App() {
  const [counter2Value, setCounter2Value] = useValues(
    countersValuesContainer,
    "counter2",
    0
  );

  useEffect(() =>
    emptyValuesContainer.dispatch(
      "initialized onComponentMount",
      "the value after mounting",
      []
    )
  );

  const handleClick = () => {
    countersValuesContainer.dispatch("counter1", 5);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h5> manipulate counte2 directly</h5>
      <pre>
        counter2 :{" "}
        {counter2Value === undefined
          ? "undefined"
          : JSON.stringify(counter2Value)}
      </pre>
      <button type="button" onClick={() => setCounter2Value(counter2Value + 1)}>
        increment counter2
      </button>
      <hr />
      <h5> read from values container without any initial values</h5>
      <DisplayContainer />
      <button type="button" onClick={handleClick}>
        Set counter1 to 5
      </button>
      <button type="button" onClick={clearValue}>
        Set counter1 to 0
      </button>
      <IncrementButton />
      <DecrementButton />
      <hr />
      <h5>
        read from values container initialized with Object of key:value pairs
        &#123;key1: 1, key2: 2&#125;
      </h5>
      <DisplayValueByKey valueKey="key1" />
      <IncrementValueButton valueKey="key1" />
      <br />
      <DisplayValueByKey valueKey="key2" />
      <IncrementValueButton valueKey="key2" />
      <hr />
      <h5>
        read from values container initalized with Array [['keyX', 'valueX'],
        ['keyY', 'valueY']
      </h5>
      <DisplayValueByContainerAndKey
        valuesContainer={initWithArrayValuesContainer}
        valueKey="keyX"
      />
      <DisplayValueByContainerAndKey
        valuesContainer={initWithArrayValuesContainer}
        valueKey={1}
      />
      <hr />
      <h5>
        read from values container who got value on component mount -
        useEffect(()=&#123;&#125;, []){" "}
      </h5>
      value initialized in useEffect(()=&#123;&#125;, [])
      <DisplayValueByContainerAndKey
        valuesContainer={emptyValuesContainer}
        valueKey="initialized onComponentMount"
      />
      display non-existing value
      <DisplayValueByContainerAndKey
        valuesContainer={emptyValuesContainer}
        valueKey="missing value"
      />
    </div>
  );
}

const ValueText = () => {
  const [myValue] = useValues(countersValuesContainer, "counter1");
  return (
    <pre>
      counter1 : {myValue === undefined ? "undefined" : JSON.stringify(myValue)}
    </pre>
  );
};

const DisplayContainer = () => {
  return (
    <span>
      <ValueText />
    </span>
  );
};

const IncrementButton = () => {
  const [myValue, setMyValue] = useValues(countersValuesContainer, "counter1");
  return (
    <button type="button" onClick={() => setMyValue(myValue + 1)}>
      increment counter1
    </button>
  );
};

const DecrementButton = () => {
  const [myValue, setMyValue] = useValues(countersValuesContainer, "counter1");
  return (
    <button type="button" onClick={() => setMyValue(myValue - 1)}>
      decrement counter1
    </button>
  );
};

const IncrementValueButton = ({ valueKey }) => {
  const [myValue, setMyValue] = useValues(
    initWithObjectValuesContainer,
    valueKey
  );
  return (
    <button type="button" onClick={() => setMyValue(myValue + 1)}>
      increment
    </button>
  );
};

const DisplayValueByKey = ({ valueKey }) => {
  const [myValue] = useValues(initWithObjectValuesContainer, valueKey);
  return (
    <pre>
      {valueKey} :
      {myValue === undefined ? "undefined" : JSON.stringify(myValue)}
    </pre>
  );
};

const DisplayValueByContainerAndKey = ({ valuesContainer, valueKey }) => {
  const [myValue] = useValues(valuesContainer, valueKey);
  return (
    <pre>
      {valueKey} :
      {myValue === undefined ? "undefined" : JSON.stringify(myValue)}
    </pre>
  );
};

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement("div"))
);
