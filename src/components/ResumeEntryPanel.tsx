import { useEffect, useState } from "react";
import { useTimeStore } from "../hooks";
import { isSameDay } from 'date-fns';
import { toHHMM } from "../utilities";


const ResumeEntryPanel = () => {
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const activeEntry = useTimeStore(state => state.activeEntry);
  const [resumableEntry, setResumableEntry] = useState(null);
  const weekEntries = useTimeStore(state => state.weekEntries);


  useEffect(() => {
    const today = new Date();
    let entry = weekEntries
      .find(entry =>
        entry.endDate === "" &&
        isSameDay(entry.start, today) &&
        entry.id !== activeEntry?.id
      );
    setResumableEntry(entry);
  }, [weekEntries, activeEntry]);

  const handleResumeEntry = () => {
    setActiveEntry(resumableEntry);
    setResumableEntry(null);
  }

  if (!resumableEntry) return null;

  return (
    <>
      <div className="mt-2 text-center">
        <button className="btn btn-link" onClick={handleResumeEntry}>Resume your {toHHMM(resumableEntry?.start)} entry?</button>
      </div>
    </>
  );
}

export default ResumeEntryPanel;