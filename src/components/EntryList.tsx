import { useEffect, useState } from "react";
import '../App.css';
import { useTimeStore, useNow, useCompanyStore, useActiveSessionTime } from '../hooks';
import type { TimeEntry } from '../types';
import { EditTimeModal, TotalTime } from '../components';
import { formatMinutes } from '../utilities';
import { startOfWeek, endOfWeek } from "date-fns";

const EntryList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const timeEntries = useTimeStore((state) => state.entries);
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  const deleteEntry = useTimeStore((state) => state.deleteEntry);
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const activeEntry = useTimeStore((state) => state.activeEntry);
  const activeCompany = useCompanyStore(state => state.activeCompany);
  const updateEntry = useTimeStore(state => state.updateEntry);
  const filterStart = useTimeStore(state => state.filterStart)
  const filterEnd = useTimeStore(state => state.filterEnd)

  const { totalMinutes } = useActiveSessionTime(activeEntry?.start ?? null);

  useEffect(() => {
    if(activeCompany) {
      refreshTimeEntries({ company: activeCompany });
    }
  }, [activeCompany])

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

  const allBilled = timeEntries.every(e => (e.billed == "1"));
  const handleBillAll = () => {
    timeEntries.forEach(timeEntry => {
      const payload = { id: timeEntry.id, startDate: timeEntry.startDate, endDate: timeEntry.endDate, billed: allBilled ? "0" : "1" }
      updateEntry(payload);
    });
  }

  const selectFullWeek = () => {
    if (!filterStart) return;

    const start = startOfWeek(filterStart, { weekStartsOn: 0 });
    const end = endOfWeek(filterEnd || filterStart, { weekStartsOn: 0 });

    refreshTimeEntries({ newStart: start, newEnd: end, company: activeCompany });
  };

  const selectToday = () => {
    const start = new Date();
    const end = new Date();

    refreshTimeEntries({ newStart: start, newEnd: end, company: activeCompany });
  };

  const isToday = () => {
    return filterStart.toDateString() === (new Date()).toDateString()
      && filterEnd.toDateString() === (new Date()).toDateString();
  }

  const isWeek = () => {
    const start = startOfWeek(filterStart, { weekStartsOn: 0 });
    const end = endOfWeek(filterEnd || filterStart, { weekStartsOn: 0 });
    return filterStart.toDateString() === start.toDateString() && filterEnd.toDateString() === end.toDateString();
  }

  return (
    <div className="time-entry-line-container">
      <div className="time-entry-title">Time Entries</div>
      <div className="entry-list-action-bar">
        <div className="mb-2">
          <button type="button" onClick={handleBillAll} className="btn btn-secondary me-5">Toggle Billed</button>
          Filters:
          <button className={`btn btn-outline-success m-1 p-1 ${isWeek() ? " active" : ""}`} onClick={selectFullWeek}>
            Week
          </button>
          <button className={`btn btn-outline-success m-1 p-1 ${isToday() ? " active" : ""}`} onClick={selectToday}>
            Today
          </button>
        </div>
        <TotalTime />
      </div>
      <table className="table table-striped" style={{width: "100%"}}>
        <thead>
          <tr>
            <th></th>
            <th>Billed</th>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Total Time</th>
          </tr>
        </thead>
        <tbody>
          {timeEntries.length === 0 && <tr><td colSpan={6}>No Entries</td></tr>}
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
                {timeEntry.endDate === '' && timeEntry.id !== activeEntry?.id && <button onClick={() => handleResumeEntry(timeEntry)} className='btn btn-link'>Resume</button>}
                {timeEntry.endDate === '' && timeEntry.id === activeEntry?.id && <div className='btn btn-link'>In Progress</div>}
              </td>
              <td>
                {timeEntry.endDate !== '' && formatMinutes(timeEntry.durationMinutes)}
                {timeEntry.endDate === '' && timeEntry.id === activeEntry?.id && <div className='btn btn-link'>{formatMinutes(totalMinutes)}</div>}
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
