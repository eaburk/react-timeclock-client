import { useState, useEffect } from "react";
import '../App.css';
import CompanySelection from './CompanySelection';
import RecordTimeWidget from './RecordTimeWidget';
import EntryList from './EntryList';

function MainContentPanel() {

  return (
    <div className="entry-list-container">
      <CompanySelection />
      <RecordTimeWidget />
      <EntryList />
    </div>
  );
}

export default MainContentPanel;
