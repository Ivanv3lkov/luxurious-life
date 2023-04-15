import { useReducer, useEffect, ChangeEvent } from 'react';

import { validate, ValidatorActions } from '../../../util/validators';

import './Input.css';

type InputReducerState = {
  value: string;
  isTouched: boolean;
  isValid: boolean;
};

enum InputActionTypes {
  CHANGE = 'CHANGE',
  TOUCH = 'TOUCH'
}

type ChangeAction = {
  type: InputActionTypes.CHANGE;
  val: string;
  validators: any;
};

type TouchAction = {
  type: InputActionTypes.TOUCH;
};

type InputActions = ChangeAction | TouchAction;

const inputReducer = (state: InputReducerState, action: InputActions) => {
  switch (action.type) {
    case InputActionTypes.CHANGE:
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case InputActionTypes.TOUCH: {
      return {
        ...state,
        isTouched: true
      };
    }
    default:
      return state;
  }
};

type Props = {
  id: string;
  element: string;
  type?: string;
  label: string;
  validators: ValidatorActions[];
  errorText: string;
  onInput: (id: string, value: string, isValid: boolean) => void;
  initialValue?: string;
  initialValid?: boolean;
};

const Input: React.FC<Props> = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event: ChangeEvent<any>) => {
    dispatch({
      type: InputActionTypes.CHANGE,
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: InputActionTypes.TOUCH
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        maxLength={50}
        rows={3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
