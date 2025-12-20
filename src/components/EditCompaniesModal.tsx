import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCompanyStore } from '../hooks';
import type { TimeEntry } from '../types';
import { updateTimeEntry } from '../services';

type EditCompaniesModalProps = {
  show: boolean;
  handleClose: () => void;
};

const EditCompaniesModal: React.FC<EditCompaniesModalProps> = ({ show, handleClose }) => {
  const [newCompanyName, setNewCompanyName] = useState('');
  const companies = useCompanyStore(state => state.companies);
  const createNewCompany = useCompanyStore(state => state.createNewCompany);
  const deleteCompany = useCompanyStore(state => state.deleteCompany);

  const handleNewCompanyNameChange = (event) => {
    setNewCompanyName(event.target.value);
  }

  const handleSaveCompany = async () => {
    createNewCompany({ description: newCompanyName });
    setNewCompanyName('');
  }

  const handleDeleteEntry = (company) => {
    if(confirm('Really delete this company?')){
      deleteCompany(company.id);
    }
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Companies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          Add New: 
          <input className="ms-3" type="text" onChange={event => handleNewCompanyNameChange(event)} value={newCompanyName} />
          <button className="btn btn-primary ms-3" onClick={handleSaveCompany}>Save</button>
        </div>

        <div className="mt-5">
          {companies.map(company => (
            <div>
              <button title="Delete Company" type="button" onClick={() => handleDeleteEntry(company)} className="normal mx-2">❌</button>
              {company.description}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCompaniesModal;
