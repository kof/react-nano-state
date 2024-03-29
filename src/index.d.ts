declare module "react-nano-state" {
  type Dispatch<ValueType> = (value: ValueType) => void;

  type ValueContainer<ValueType> = {
    value: ValueType;
    dispatch: Dispatch<ValueType>;
    subscribe: (callback: (value: ValueType) => void) => void;
  };

  export function createValueContainer<ValueType>(
    initialValue?: ValueType
  ): ValueContainer<ValueType>;

  export function useValue<ValueType>(
    valueContainer: ValueContainer<ValueType>
  ): [ValueType, Dispatch<ValueType>];
}
