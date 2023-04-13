import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StoreState } from '../../store';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';

import './HomeForm.css';

const UpdateHome: React.FC = () => {
  const { accessToken, userId } = useSelector((state: StoreState) => state.user);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedHome, setLoadedHome] = useState<any>();
  const { homeId } = useParams<{ homeId: string }>();
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
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
      }
    },
    false
  );

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/homes/${homeId}`);
        setLoadedHome(responseData.home);
        setFormData(
          {
            title: {
              value: responseData.home.title,
              isValid: true
            },
            description: {
              value: responseData.home.description,
              isValid: true
            },
            address: {
              value: responseData.home.address,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchHome();
  }, [sendRequest, homeId, setFormData]);

  const homeUpdateSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/homes/${homeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      );
      history.push('/' + userId + '/homes');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedHome && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find home!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedHome && (
        <form className="home-form" onSubmit={homeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedHome.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedHome.description}
            initialValid={true}
          />
           <Input
            id="address"
            element="input"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address."
            onInput={inputHandler}
            initialValue={loadedHome.address}
            initialValid={true}
          />
          <div className="home-form__buttons">
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE HOME
            </Button>
            <Button to={`/${userId}/homes`}>CANCEL</Button>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateHome;
