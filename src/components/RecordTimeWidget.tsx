import { useState, useEffect } from "react";
import '../App.css';
import { saveTimeEntry } from '../services/apiService';
import { useTimeStore } from '../hooks/useTimeStore';
import type { DateValue } from '../types/dataTypes';

function RecordTimeWidget() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutTime, setClockOutTime] = useState<string>('');
  const [inputDisabled, setInputDisabled] = useState<boolean>(true);
  const [now, setNow] = useState<DateValue>(null);
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  const setCurrentClockIn = useTimeStore((state) => state.setCurrentClockIn);

  const handleClockIn = () => {
    setClockedIn(true);
    const newNow = new Date();
    setNow(newNow);
    setClockInTime(newNow.toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', ''));
    setClockOutTime('');
    setInputDisabled(true);
  }
  useEffect(() => {
    setCurrentClockIn(now);
  }, [now]);

  const handleClockOut = async () => {
    setClockedIn(false);
    setCurrentClockIn(null);
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
    setInputDisabled(true);

    const formData = new FormData();
    formData.set('endDate', clockOutTime);
    formData.set('startDate', clockInTime);
    await saveTimeEntry(Object.fromEntries(formData.entries()));

    await refreshTimeEntries();
  }

  const handleEditTime = () => {
    setInputDisabled(!inputDisabled);
  }

  const handleClockInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClockInTime(event.currentTarget.value);
    setNow(event.currentTarget.value ? (new Date(event.currentTarget.value)) : null);
  }

  return (
    <div className="record-time-container">
      <form>
        <div className="record-time-div">
          <button disabled={clockedIn} className="btn btn-primary" onClick={handleClockIn}>
            Clock In
          </button>

          <input className='form-input' type="text" name="startDate" disabled={inputDisabled} value={clockInTime} onChange={event => handleClockInChange(event)} />

          <button type="button" onClick={handleEditTime} className='normal'>📝</button>
         </div>
        <div className="record-time-div">
          <button disabled={!clockedIn} className="btn btn-secondary" onClick={handleClockOut}>
            Clock Out
          </button>

          <input type="text" name="endDate" disabled={inputDisabled} value={clockOutTime} onChange={event => setClockOutTime(event.target.value)} />

        </div>
      </form>
    </div>
  );
}

export default RecordTimeWidget;

