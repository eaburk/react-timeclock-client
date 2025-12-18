import { useEffect, useState } from "react";
import '../App.css';
import { useTimeStore } from '../hooks';
import type { TimeEntry } from '../types';
import EditTimeModal from './EditTimeModal';

const EntryList = () => {
  const timeEntries = useTimeStore((state) => state.entries);
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  const deleteEntry = useTimeStore((state) => state.deleteEntry);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

  useEffect(() => {
    refreshTimeEntries()
  }, [])

  const getTotalTime = (timeEntry: TimeEntry) => {
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
    if(confirm('Are you sure?')) {
      await deleteEntry(timeEntry.id);
    }
  }

  return (
    <div className="time-entry-line-container">
      <table className="time-entries-table" style={{width: "100%"}}>
        <thead>
          <tr>
            <th></th>
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
                <button type="button" onClick={() => handleEditEntry(timeEntry)} className="normal mx-2">📝</button>
                <button type="button" onClick={() => handleDeleteEntry(timeEntry)} className="normal mx-2">❌</button>
              </td>
              <td>
                {timeEntry.start.toLocaleDateString()}
                {timeEntry.start.toLocaleDateString() !== timeEntry.end.toLocaleDateString() ? `${- timeEntry.end.toLocaleDateString()}`: ""}
              </td>
              <td>
                {timeEntry.start.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}
              </td>
              <td>
                {timeEntry.end.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}
              </td>
              <td>
                {getTotalTime(timeEntry)}
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
