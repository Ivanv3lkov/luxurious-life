import logo from '../../../../assets/logo.png';

const Logo: React.FC = () => {
  return (
    <a className="header_logo" href='/'>
      <img src={logo} alt="main logo" />
    </a>
  );
};

export default Logo;
