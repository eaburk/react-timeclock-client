import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTimeStore, useCompanyStore } from '../hooks';

type AddTimeModalProps = {
  show: boolean;
  handleClose: () => void;
};

const AddTimeModal: React.FC<AddTimeModalProps> = ({ show, handleClose }) => {
  const createEntry = useTimeStore(state => state.createEntry);
  const activeCompany = useCompanyStore(state => state.activeCompany);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = async () => {
    const formData = new FormData();
    formData.set('endDate', endTime);
    formData.set('startDate', startTime);
    formData.set('companyId', activeCompany.id);

    await createEntry(Object.fromEntries(formData.entries()));
    setStartTime('');
    setEndTime('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Time Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formClockIn">
            <Form.Label>Clock In</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formClockOut">
            <Form.Label>Clock Out</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endTime || ''}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTimeModal;
