import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { authSuccess } from '../../store/user/userActions';
import Card from '../../shared/components/UIElements/Card/Card';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';

import './Auth.css';

export type InitialAuthFormInputs = {
  email: {
    value: string;
    isValid: boolean;
  };
  password: {
    value: string;
    isValid: boolean;
  };
};

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const { error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm<InitialAuthFormInputs, boolean>(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          firstName: undefined,
          lastName: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          firstName: {
            value: '',
            isValid: false
          },
          lastName: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: any) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          { 'Content-Type': 'application/json' }
        );

        dispatch(authSuccess(responseData));
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('firstName', formState.inputs.firstName.value);
        formData.append('lastName', formState.inputs.lastName.value);
        formData.append('image', formState.inputs.image.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/register',
          'POST',
          formData
        );

        dispatch(authSuccess(responseData));
      } catch (err) {}
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        <h2>{isLoginMode ? 'Login' : 'Registration'}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <>
              <Input
                element="input"
                id="firstName"
                type="text"
                label="First Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your first name."
                onInput={inputHandler}
              />
              <Input
                element="input"
                id="lastName"
                type="text"
                label="Last Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your last name."
                onInput={inputHandler}
              />
              <ImageUpload
                id="image"
                center
                onInput={inputHandler}
                errorText="Please provide an image."
              />
            </>
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
