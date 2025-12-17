import { useState, useEffect } from "react";
import type { DateValue } from "../types";
import type { Company } from "../types/Company";
import '../App.css';
import { fetchCompanies } from "../services/apiService";

function CompanySelection() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchCompanies()
      .then(data => {
        setCompanies(data);
      })
      .catch(error => {
        console.log("Error fetching companies:", error);
      })
      .finally(() => {
        setIsLoading(false)
      });
  }, []);

  return (
    <div className='company-selection-container'>
      <div>
        Company:
      </div>
      <div>
        <select id='slctCompany'>
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
