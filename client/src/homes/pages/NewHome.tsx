import { FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StoreState } from '../../store';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';

import './HomeForm.css';

type InitialHomeFormInputs = {
  title: {
    value: string;
    isValid: boolean;
  };
  description: {
    value: string;
    isValid: boolean;
  };
  address: {
    value: string;
    isValid: boolean;
  };
  image: {
    value: string;
    isValid: boolean;
  };
};

const NewHome: React.FC = () => {
  const { accessToken } = useSelector((state: StoreState) => state.user);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm<InitialHomeFormInputs, boolean>(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
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

  const homeSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      await sendRequest('http://localhost:8000/api/homes', 'POST', formData, {
        Authorization: 'Bearer ' + accessToken
      });
      history.push('/');
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="home-form" onSubmit={homeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
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
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image." />
        <Button type="submit" disabled={!formState.isValid}>
          Add Home
        </Button>
      </form>
    </>
  );
};

export default NewHome;
