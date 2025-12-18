import { useState, useEffect } from "react";
import '../App.css';
import { saveTimeEntry } from '../services/apiService';
import { useTimeStore } from '../hooks/useTimeStore';

function RecordTimeWidget() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');
  const [inputDisabled, setInputDisabled] = useState(true);
  const [now, setNow] = useState(null);
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

  const handleClockInChange = (event, value) => {
    setClockInTime(event.target.value);
    setNow(new Date(event.target.value));
  }

  return (
    <div className="record-time-container">
      <form>
        <div>
          <button disabled={clockedIn} className="record-punch" onClick={handleClockIn}>
            Clock In
          </button>

          <input type="text" name="startDate" disabled={inputDisabled} value={clockInTime} onChange={event => handleClockInChange(event)} />

          <button type="button" onClick={handleEditTime} className='normal'>📝</button>
         </div>
        <div>
          <button disabled={!clockedIn} className="record-punch" onClick={handleClockOut}>
            Clock Out
          </button>

          <input type="text" name="endDate" disabled={inputDisabled} value={clockOutTime} onChange={event => setClockOutTime(event.target.value)} />

        </div>
      </form>
    </div>
  );
}

export default RecordTimeWidget;

