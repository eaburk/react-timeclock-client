import { useState, useEffect } from "react";
import type { TimeEntry } from "../types/TimeEntry";
import '../App.css';
import { useTimeStore } from '../hooks/useTimeStore.js';

function EntryList() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const timeEntries = useTimeStore((state) => state.entries);
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  useEffect(() => {
    refreshTimeEntries()
  }, [])

  const getTotalTime = (timeEntry: date) => {
    let difference = Math.abs(timeEntry.end.getTime() - timeEntry.start.getTime());
    let totalMinutes = Math.floor(difference / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60; // The modulo operator (%) gives the remainder

    return `${hours}h ${minutes}m`;
  }

  const handleEditEntry = (timeEntry) => {
    console.log(timeEntry);
  }

  return (
    <div className="time-entry-line-container">
      <table className="time-entries-table" style={{width: "100%"}}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Total Time</th>
          </tr>
        </thead>
        <tbody>
          {timeEntries.map(timeEntry => (
            <tr key={timeEntries.id}>
              <td>
                <button type="button" onClick={() => handleEditEntry(timeEntry)} className="normal">📝</button>
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
    </div>
  );
}

export default EntryList;
