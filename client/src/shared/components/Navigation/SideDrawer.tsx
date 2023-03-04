import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

type Props = {
  show: boolean;
  onClick: () => void;
  children: ReactNode;
};

const SideDrawer: React.FC<Props> = ({ show, onClick, children }) => {
  const content = (
    <CSSTransition in={show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit>
      <aside className="side-drawer" onClick={onClick}>
        {children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook') as HTMLElement);
};

export default SideDrawer;
