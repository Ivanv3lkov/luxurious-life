import GuestNavigation from './GuestNavigation/GuestNavigation';
import UserNavigation from './UserNavigation/UserNavigation';

import Logo from './Logo/Logo';

const Header: React.FC = () => {
  const user = {
    email: 'test@gmail.com'
  };

  return (
    <>
      <div>
        <Logo />
      </div>
      {user?.email ? <UserNavigation /> : <GuestNavigation />}
    </>
  );
};

export default Header;
