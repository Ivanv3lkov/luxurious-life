import { ReactNode } from 'react';
import './MainHeader.css';

type Props = {
  children: ReactNode;
};

const MainHeader: React.FC<Props> = ({ children }) => {
  return <header className="main-header">{children}</header>;
};

export default MainHeader;
