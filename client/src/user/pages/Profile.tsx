import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { StoreState } from '../../store';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Card from '../../shared/components/UIElements/Card/Card';
import Avatar from '../../shared/components/UIElements/Avatar/Avatar';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

import './Profile.css';

const Profile = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { firstName, lastName, email, image, userId } = useSelector(
    (state: StoreState) => state.user
  );
  const [profileState, setProfileState] = useState<{ sharedHomes: number; sharedCars: number }>({
    sharedHomes: 0,
    sharedCars: 0
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:8000/api/users/${userId}`);

        setProfileState((prevState) => {
          return {
            ...prevState,
            sharedHomes: responseData.user.homes.length,
            sharedCars: responseData.user.cars.length
          };
        });
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest, userId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && profileState && (
        <div className="profile-item__content">
          <Card className="profile-item__card">
            <header>
              <h1>
                <strong>Profile</strong>
              </h1>
              <div className="profile-item__image">
                <Avatar image={`http://localhost:8000/${image}`} alt={'image'} />
              </div>
            </header>
            <hr></hr>
            <h2>First Name: {firstName}</h2>
            <h2>Last Name: {lastName}</h2>
            <h2>Email: {email}</h2>
            <hr></hr>
            <div className='profile-item__items-count'>
              <h2>Shared homes: {profileState.sharedHomes}</h2>
              <h2>Shared cars: {profileState.sharedCars}</h2>
            </div>
            <hr></hr>
            <div className="profile-item__btns">
              <Button to={'/'} size="big">
                Edit
              </Button>
              <Button size="big" danger>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Profile;
