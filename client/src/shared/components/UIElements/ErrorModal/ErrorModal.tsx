import Modal from '../Modal/Modal';
import Button from '../../FormElements/Button/Button';

type Props = {
  error: string | null | undefined;
  onClear: () => void;
};

const ErrorModal: React.FC<Props> = ({ onClear, error }) => {
  return (
    <Modal
      onCancel={onClear}
      header="An Error Occurred!"
      show={!!error}
      footer={<Button onClick={onClear}>Okay</Button>}
    >
      <p>{error}</p>
    </Modal>
  );
};

export default ErrorModal;
