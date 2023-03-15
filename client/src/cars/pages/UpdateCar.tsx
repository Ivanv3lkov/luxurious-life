import React, { useEffect, useState, useContext, FormEvent } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { AuthContext } from '../../shared/context/authContext';

import './CarForm.css';

const UpdateCar: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCar, setLoadedCar] = useState<any>();
  const { carId } = useParams<{ carId: string }>();
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      model: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );
    
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:8000/api/cars/${carId}`);
        setLoadedCar(responseData.car);
        setFormData(
          {
            model: {
              value: responseData.car.model,
              isValid: true
            },
            description: {
              value: responseData.car.description,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchCar();
  }, [sendRequest, carId, setFormData]);
  
  const carUpdateSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:8000/api/cars/${carId}`,
        'PATCH',
        JSON.stringify({
          model: formState.inputs.model.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/' + auth.userId + '/cars');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedCar && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find car!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedCar && (
        <form className="car-form" onSubmit={carUpdateSubmitHandler}>
          <Input
            id="model"
            element="input"
            type="text"
            label="Model"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid model."
            onInput={inputHandler}
            initialValue={loadedCar.model}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedCar.description}
            initialValid={true}
          />
          <div className="car-form__buttons">
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE CAR
            </Button>
            <Button to={`/${auth.userId}/cars`}>CANCEL</Button>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateCar;
