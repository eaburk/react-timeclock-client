import { useState, useEffect } from "react";
import '../App.css';
import { useCompanyStore } from '../hooks';
import { EditCompaniesModal } from "./";

const NavBar = () => {
  const [showModal, setShowModal] = useState(false);
  const companies = useCompanyStore(state => state.companies);
  const refreshCompanies = useCompanyStore(state => state.refreshCompanies);
  const setActiveCompany = useCompanyStore(state => state.setActiveCompany);
  const activeCompany = useCompanyStore(state => state.activeCompany);

  useEffect(() => {
    refreshCompanies();
  }, []);

  useEffect(() => {
    //when app loads, default to first company in list
    if(activeCompany === null && companies.length > 0){
      setActiveCompany(companies[0]);
    }
  }, [companies]);

  const handleCompanyChange = (company) => {
    setActiveCompany(company);
  }

  const handleEditCompanies = () => {
    setShowModal(true);
  }

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Timeclock</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Company ({activeCompany?.description})
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                {companies.map((company, index) => (
                  <div key={company.id}> {/* Use a Fragment or wrapper */}
                    <li className="dropdown-item" value={company.id} onClick={() => handleCompanyChange(company)}>
                      {company.description} {company.id === activeCompany?.id && <i className="fa fa-check"></i>}
                    </li>
                  </div>
                ))}
                <li key={`divider}`} className="dropdown-divider"></li>
                <li key={"edit-companies"} className="dropdown-item" onClick={handleEditCompanies}>Edit Companies</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <EditCompaniesModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </nav>
  )
}

export default NavBar;