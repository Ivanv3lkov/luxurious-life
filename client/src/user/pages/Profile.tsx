import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { StoreState } from '../../store';
import { authUpdate, logout } from '../../store/user/userActions';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import Card from '../../shared/components/UIElements/Card/Card';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import Avatar from '../../shared/components/UIElements/Avatar/Avatar';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const { firstName, lastName, email, image, userId, accessToken, homesCount, carsCount } =
    useSelector((state: StoreState) => state.user);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`, 'DELETE', null, {
        Authorization: 'Bearer ' + accessToken
      });
      dispatch(logout());
    } catch (err) {}
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );

        dispatch(
          authUpdate({
            firstName: responseData.user.firstName,
            lastName: responseData.user.lastName,
            homesCount: responseData.user.homes.length,
            carsCount: responseData.user.cars.length
          })
        );
      } catch (err) {}
    };
    fetchProfile();
  }, [dispatch, sendRequest, userId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="profile-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete your account? Please note that it can't be undone
          thereafter.
        </p>
      </Modal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && email && (
        <div className="profile-item__content">
          <Card className="profile-item__card">
            <header>
              <h1>
                <strong>Profile</strong>
              </h1>
              <div className="profile-item__image">
                <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${image}`} alt={'image'} />
              </div>
            </header>
            <hr></hr>
            <div className="profile-item__info">
              <h3>First Name: {firstName}</h3>
              <h3>Last Name: {lastName}</h3>
              <h3>Email: {email}</h3>
            </div>
            <hr></hr>
            <div className="profile-item__items-count">
              <h3>Shared homes: {homesCount}</h3>
              <h3>Shared cars: {carsCount}</h3>
            </div>
            <hr></hr>
            <div className="profile-item__actions">
              <Button to={`/${userId}/profile/edit`}>EDIT</Button>
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Profile;
