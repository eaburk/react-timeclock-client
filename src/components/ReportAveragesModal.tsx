import { Modal, Button } from 'react-bootstrap';

type ReportAveragesModalProps = {
  show: boolean;
  handleClose: () => void;
};

const test = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu', 'vwx', 'yz'];

const ReportAveragesModal: React.FC<ReportAveragesModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Averages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {test.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportAveragesModal;
