import { useState, useEffect } from "react";
import type { Company } from "../types";
import '../App.css';
import { EditCompaniesModal } from "../components";
import { useCompanyStore } from '../hooks';

const CompanySelection = () => {
  const [showModal, setShowModal] = useState(false);
  const refreshCompanies = useCompanyStore(state => state.refreshCompanies);
  const companies = useCompanyStore(state => state.companies);
  const setActiveCompany = useCompanyStore(state => state.setActiveCompany);
  const activeCompany = useCompanyStore(state => state.activeCompany);

  useEffect(() => {
    refreshCompanies();
  }, []);

  useEffect(() => {
    if(activeCompany === null && companies.length > 0){
      setActiveCompany(companies[0]);
    }
  }, [companies]);

  const handleEditCompanies = () => {
    setShowModal(true);
  }

  const handleCompanyChange = (event) => {
    setActiveCompany(companies.find(c => c.id == event.currentTarget.value));
  }

  return (
    <div className='company-selection-container'>
      <div>
        Company:
      </div>
      <div>
        <select id='slctCompany' className='form-select' onChange={handleCompanyChange}>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.description}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button id="btnEditCompanies" className='normal' onClick={handleEditCompanies}>📝</button>
      </div>
      <EditCompaniesModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default CompanySelection;
