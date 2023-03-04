import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Backdrop from '../Backdrop/Backdrop';

import './Modal.css';

type Props = {
  show: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  header?: string;
  footer?: ReactNode;
  style?: object;
  className?: string;
  headerClass?: string;
  contentClass?: string;
  footerClass?: string;
  children?: ReactNode;
};

const ModalOverlay: React.FC<Props> = ({
  header,
  style,
  onSubmit,
  className,
  headerClass,
  contentClass,
  footerClass,
  footer,
  children
}) => {
  const content = (
    <div className={`modal ${className}`} style={style}>
      <header className={`modal__header ${headerClass}`}>
        <h2>{header}</h2>
      </header>
      <form onSubmit={onSubmit ? onSubmit : (event) => event.preventDefault()}>
        <div className={`modal__content ${contentClass}`}>{children}</div>
        <footer className={`modal__footer ${footerClass}`}>{footer}</footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook') as HTMLElement);
};

const Modal: React.FC<Props> = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames="modal">
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
