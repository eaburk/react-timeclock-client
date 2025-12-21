import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTimeStore } from '../hooks';
import type { TimeEntry } from '../types';

type EditTimeModalProps = {
  show: boolean;
  handleClose: () => void;
  entryToEdit: TimeEntry | null;
};

const EditTimeModal: React.FC<EditTimeModalProps> = ({ show, handleClose, entryToEdit }) => {
  const updateEntry = useTimeStore(state => state.updateEntry);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const activeEntry = useTimeStore(state => state.activeEntry);

  const getLocalDatetimeString = (curDate: Date) => {
    const now = curDate;
    const offset = now.getTimezoneOffset(); 
    const localTime = new Date(now.getTime() - (offset * 60000)); 
    return localTime.toISOString().slice(0, 16); 
  };

  useEffect(() => {
    if (entryToEdit) {
      setStartTime(getLocalDatetimeString(new Date(entryToEdit.startDate)));
      if(entryToEdit.endDate !== "") {
        setEndTime(getLocalDatetimeString(new Date(entryToEdit.endDate)));
      } else {
        setEndTime('');
      }
    }
  }, [entryToEdit]);
  
  const handleSave = async () => {
    if (!entryToEdit) return;


    entryToEdit.startDate = new Date(startTime).toISOString();
    entryToEdit.start = new Date(entryToEdit.startDate);
    if(endTime !== "") {
      entryToEdit.endDate = new Date(endTime).toISOString();
    entryToEdit.end = new Date(entryToEdit.endDate);
    }

    await updateEntry(entryToEdit);
    if(entryToEdit.id === activeEntry?.id) {
      setActiveEntry(entryToEdit);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Time Entry</Modal.Title>
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
            <Form.Text className="text-muted">
              Leave empty if the entry is still active.
            </Form.Text>
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

export default EditTimeModal;
