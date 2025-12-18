import { useState, useEffect } from "react";
import type { Company } from "../types";
import '../App.css';
import { fetchCompanies } from "../services";

const CompanySelection = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchCompanies()
      .then(data => {
        setCompanies(data);
      })
      .catch(error => {
        console.log("Error fetching companies:", error);
      });
  }, []);

  return (
    <div className='company-selection-container'>
      <div>
        Company:
      </div>
      <div>
        <select id='slctCompany' className='form-select'>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.description}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button id="btnEditCompanies" className='normal'>📝</button>
      </div>
    </div>
  );
}

export default CompanySelection;
