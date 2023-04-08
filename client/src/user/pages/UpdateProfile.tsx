import React, { useEffect, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StoreState } from '../../store';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';

import './Profile.css';

const UpdateProfile: React.FC = () => {
  const { accessToken, userId, firstName, lastName } = useSelector((state: StoreState) => state.user);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  
  const [formState, inputHandler, setFormData] = useForm(
    {
      firstName: {
        value: '',
        isValid: false
      },
      lastName: {
        value: '',
        isValid: false
      }
    },
    false
  );
    
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:8000/api/users/${userId}`);
        setFormData(
          {
            firstName: {
              value: responseData.user.firstName,
              isValid: true
            },
            lastName: {
              value: responseData.user.lastName,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchProfile();
  }, [sendRequest, setFormData, userId]);

  const profileUpdateSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:8000/api/users/${userId}`,
        'PATCH',
        JSON.stringify({
          firstName: formState.inputs.firstName.value,
          lastName: formState.inputs.lastName.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      );
      history.push('/' + userId + '/profile');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!userId && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find profile!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && userId && (
        <form className="profile-form" onSubmit={profileUpdateSubmitHandler}>
          <Input
            id="firstName"
            element="input"
            type="text"
            label="First Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid first name."
            onInput={inputHandler}
            initialValue={firstName || ''}
            initialValid={true}
          />
          <Input
            id="lastName"
            element="input"
            label="Last Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid last name."
            onInput={inputHandler}
            initialValue={lastName || ''}
            initialValid={true}
          />
          <div className="profile-form__buttons">
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE PROFILE
            </Button>
            <Button to={`/${userId}/profile`}>CANCEL</Button>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateProfile;
