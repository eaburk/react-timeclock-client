import { useState, useEffect } from "react";
import '../App.css';
import { useTimeStore, useCompanyStore } from '../hooks';

const RecordTimeWidget = () => {
  const [clockOutTime, setClockOutTime] = useState<string>('');
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const activeEntry = useTimeStore((state) => state.activeEntry);
  const createEntry = useTimeStore(state => state.createEntry);
  const updateEntry = useTimeStore(state => state.updateEntry);
  const deleteEntry = useTimeStore(state => state.deleteEntry);
  const activeCompany = useCompanyStore(state => state.activeCompany);

  function formatLocalDateTime(date) {
    if(!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleClockIn = async () => {
    const newNow = (new Date()).toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');

    const formData = new FormData();
    formData.set('endDate', '');
    formData.set('startDate', newNow);
    formData.set('companyId', activeCompany.id);

    const newEntry = await createEntry(Object.fromEntries(formData.entries()));

    await setActiveEntry(newEntry);
    setClockOutTime('');

    await refreshTimeEntries({ company: activeCompany });
  }

  const handleClockOut = async () => {
    const clockOutDate = new Date();
    const clockOutTime = clockOutDate.toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');
    await setClockOutTime(clockOutTime);

    await setActiveEntry(null);

    const formData = new FormData();
    formData.set('id', activeEntry.id);
    formData.set('startDate', formatLocalDateTime(activeEntry.start));
    formData.set('endDate', formatLocalDateTime(clockOutDate));

    await updateEntry(Object.fromEntries(formData.entries()));
    await refreshTimeEntries({ company: activeCompany });
    await setClockOutTime('');
  }

  const handleCancel = async () => {
    if(confirm('Also delete this entry?')) {
      await deleteEntry(activeEntry.id);
      await refreshTimeEntries({ company: activeCompany });
    }
    await setActiveEntry(null);
  }


  return (
    <div className="record-time-container">
      <form>
        <div className="record-time-div">
          <button type="button" disabled={activeEntry !== null} className="btn btn-primary" onClick={handleClockIn}>
            Clock In
          </button>
          <button type="button" disabled={activeEntry === null} className="btn btn-secondary" onClick={handleClockOut}>
            Clock Out
          </button>
        </div>
        <div className="active-entry">
        {activeEntry && (
          <>
            In Progress:{' '}
            {activeEntry.start.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
            <button type="button" className="link-button ms-3" onClick={handleCancel}>Cancel</button>
          </>
        )}
        </div>
      </form>
    </div>
  );
}

export default RecordTimeWidget;

