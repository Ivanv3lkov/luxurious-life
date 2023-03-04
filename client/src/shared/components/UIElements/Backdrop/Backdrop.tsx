import ReactDOM from 'react-dom';

import './Backdrop.css';

type Props = {
  onClick: () => void;
};

const Backdrop: React.FC<Props> = ({ onClick }) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={onClick}></div>,
    document.getElementById('backdrop-hook') as HTMLElement
  );
};

export default Backdrop;
