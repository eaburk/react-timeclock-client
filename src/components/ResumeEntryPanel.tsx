import { useEffect, useState } from "react";
import { useTimeStore } from "../hooks";
import { isSameDay } from 'date-fns';


const ResumeEntryPanel = () => {
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const [resumableEntry, setResumableEntry] = useState(null);
  const weekEntries = useTimeStore(state => state.weekEntries);


  useEffect(() => {
    const today = new Date();
    const entry = weekEntries
      .find(entry =>
        entry.endDate === "" &&
        isSameDay(entry.start, today)
      )
    setResumableEntry(entry);
  }, [weekEntries]);

  const handleResumeEntry = () => {
    setActiveEntry(resumableEntry);
    setResumableEntry(null);
  }

  if (!resumableEntry) return null;

  return <div style={{ marginTop: "10px", padding: "15px", background: "#fff", border: "1px solid #76b467", borderRadius: "5px", textAlign: 'center' }}>
    <div>
      You have an incomplete time entry for today.<br />
      Do you want to resume it?
    </div>
    <div>
      <button className="btn btn-danger" onClick={handleResumeEntry}>Resume</button>
    </div>
  </div>;
}

export default ResumeEntryPanel;