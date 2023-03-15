import { FormEvent, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { AuthContext } from '../../shared/context/authContext';

import './CarForm.css';

type InitialCarFormInputs = {
  model: {
    value: string;
    isValid: boolean;
  };
  description: {
    value: string;
    isValid: boolean;
  };
  image: {
    value: string;
    isValid: boolean;
  };
};

const NewCar = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm<InitialCarFormInputs, boolean>(
    {
      model: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      image: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const carSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('model', formState.inputs.model.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('image', formState.inputs.image.value);
      await sendRequest('http://localhost:8000/api/cars', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });
      history.push('/');
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="car-form" onSubmit={carSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="model"
          element="input"
          type="text"
          label="Model"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid model."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image." />
        <Button type="submit" disabled={!formState.isValid}>
          Add Car
        </Button>
      </form>
    </>
  );
};

export default NewCar;
