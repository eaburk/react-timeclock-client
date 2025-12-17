import { useState, useEffect } from "react";
import '../App.css';
import { saveTimeEntry } from '../services/apiService';
import { useTimeStore } from '../hooks/useTimeStore.js';

function RecordTimeWidget() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');
  const [inputDisabled, setInputDisabled] = useState(true);
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);


  const handleClockIn = () => {
    setClockedIn(true);
    setClockInTime((new Date()).toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', ''));
  }

  const handleClockOut = async (event) => {
    setClockedIn(false);
    const clockOutTime = (new Date()).toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');
    setClockOutTime(clockOutTime);

    const formData = new FormData(); //event.target.closest('form'));
    formData.set('endDate', clockOutTime);
    formData.set('startDate', clockInTime);
    await saveTimeEntry(Object.fromEntries(formData.entries()));

    await refreshTimeEntries();
  }

  const handleChange = (event) => {
  }

  const handleEditTime = (event) => {
    setInputDisabled(!inputDisabled);
  }

  return (
    <div className="record-time-container">
      <form>
        <div>
          <button disabled={clockedIn} className="record-punch" onClick={handleClockIn}>
            Clock In
          </button>

          <input type="text" name="startDate" disabled={inputDisabled} value={clockInTime} onChange={handleChange} />

          <button type="button" onClick={handleEditTime} className='normal'>📝</button>
         </div>
        <div>
          <button disabled={!clockedIn} className="record-punch" onClick={handleClockOut}>
            Clock Out
          </button>

          <input type="text" name="endDate" disabled={inputDisabled} value={clockOutTime} onChange={handleChange} />

        </div>
      </form>
    </div>
  );
}

export default RecordTimeWidget;

