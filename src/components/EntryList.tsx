import { useEffect, useState } from "react";
import '../App.css';
import { useTimeStore, useNow, useCompanyStore } from '../hooks';
import type { TimeEntry } from '../types';
import EditTimeModal from './EditTimeModal';

const EntryList = () => {
  const timeEntries = useTimeStore((state) => state.entries);
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  const deleteEntry = useTimeStore((state) => state.deleteEntry);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const activeEntry = useTimeStore((state) => state.activeEntry);
  const activeCompany = useCompanyStore(state => state.activeCompany);
  const updateEntry = useTimeStore(state => state.updateEntry);

  const now = useNow(1000);
  let currentSessionMinutes = 0;
  let hour = 0;
  let minute = 0;
  const currentClockIn = activeEntry ? new Date(activeEntry?.startDate) : null;

  if(activeEntry) {
    currentSessionMinutes = currentClockIn
      ? Math.max(0, (now - currentClockIn.getTime()) / 60000)
      : 0;
    hour = Math.floor(currentSessionMinutes / 60);
    minute = Math.floor(currentSessionMinutes % 60);
  }

  useEffect(() => {
    if(activeCompany) {
      refreshTimeEntries({ company: activeCompany });
    }
  }, [activeCompany])

  const getTotalTime = (timeEntry: TimeEntry) => {
    if(timeEntry.end === '' || !timeEntry.end) return;

    let difference = Math.abs(timeEntry.end.getTime() - timeEntry.start.getTime());
    let totalMinutes = Math.floor(difference / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60; // The modulo operator (%) gives the remainder

    return `${hours}h ${minutes}m`;
  }

  const handleEditEntry = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleDeleteEntry = async (timeEntry: TimeEntry) => {
    if(timeEntry.endDate === "" && activeEntry?.id === timeEntry.id) {
      confirm("You can't delete an in progress entry");
      return;
    }
    if(confirm('Are you sure?')) {
      await deleteEntry(timeEntry.id);
    }
  }

  const handleResumeEntry = (timeEntry: TimeEntry) => {
    setActiveEntry(timeEntry);
  }

  const handleChangeBilled = async (event, timeEntry) => {
    const payload = { id: timeEntry.id, startDate: timeEntry.startDate, endDate: timeEntry.endDate, billed: event.currentTarget.checked ? "1" : "0" }
    await updateEntry(payload);
  }

  const handleSelectAll = (event) => {
    timeEntries.forEach(timeEntry => {
      const payload = { id: timeEntry.id, startDate: timeEntry.startDate, endDate: timeEntry.endDate, billed: event.currentTarget.checked ? "1" : "0" }
      updateEntry(payload);
    });
  }

  return (
    <div className="time-entry-line-container">
      <table className="time-entries-table" style={{width: "100%"}}>
        <thead>
          <tr>
            <th></th>
            <th>Billed<br /><input type="checkbox" onChange={handleSelectAll} checked={ timeEntries.every(e => e.billed === 1) } title="Select All" /></th>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Total Time</th>
          </tr>
        </thead>
        <tbody>
          {timeEntries.length === 0 && <tr><td colSpan={5}>No Entries</td></tr>}
          {timeEntries.map(timeEntry => (
            <tr key={timeEntry.id}>
              <td>
                <button title="Edit Entry" type="button" onClick={() => handleEditEntry(timeEntry)} className="normal mx-2">📝</button>
                <button title="Delete Entry" type="button" onClick={() => handleDeleteEntry(timeEntry)} className="normal mx-2">❌</button>
              </td>
              <td>
                <input type="checkbox" onChange={(event) => handleChangeBilled(event, timeEntry)} checked={timeEntry.billed === 1} />
              </td>
              <td>
                {timeEntry.start.toLocaleDateString()}
              </td>
              <td>
                {timeEntry.start.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}
              </td>
              <td>
                {timeEntry.endDate !== '' && timeEntry.end.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}
                {timeEntry.endDate === '' && timeEntry.id !== activeEntry?.id && <button onClick={() => handleResumeEntry(timeEntry)} className='link-button'>Resume</button>}
                {timeEntry.endDate === '' && timeEntry.id === activeEntry?.id && <div className='link-button'>In Progress</div>}
              </td>
              <td>
                {timeEntry.endDate !== '' && getTotalTime(timeEntry)}
                {timeEntry.endDate === '' && timeEntry.id === activeEntry?.id && <div className='link-button'>{hour}h {minute}m</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditTimeModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        entryToEdit={selectedEntry}
      />
    </div>
  );
}

export default EntryList;
