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
  const refreshEntries = useTimeStore((state) => state.refreshEntries);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const getLocalDatetimeString = (curDate: Date) => {
    const now = curDate;
    // Offset in minutes
    const offset = now.getTimezoneOffset(); 
    // Adjust time to local timezone
    const localTime = new Date(now.getTime() - (offset * 60000)); 
    // Get ISO string and slice to the required format: YYYY-MM-DDTHH:mm
    return localTime.toISOString().slice(0, 16); 
  };

  useEffect(() => {
    if (entryToEdit) {
      setStartTime(getLocalDatetimeString(new Date(entryToEdit.startDate))); // YYYY-MM-DDTHH:MM
      setEndTime(getLocalDatetimeString(new Date(entryToEdit.endDate))); // YYYY-MM-DDTHH:MM
    }
  }, [entryToEdit]);
  
  //useEffect(() => {
    //console.log(startTime);
  //}, [startTime]);

  const handleSave = async () => {
    if (!entryToEdit) return;

    try {
      await fetch(`/api/time-entries/${entryToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clockIn: new Date(startTime).toISOString(),
          clockOut: endTime ? new Date(endTime).toISOString() : null,
        }),
      });

      handleClose();
      refreshEntries(); // update the time entries list
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
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
              value={endTime}
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
