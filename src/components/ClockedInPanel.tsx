import { motion } from "framer-motion";
import { useActiveSessionTime, useTimeStore } from "../hooks";

const ClockedInPanel = () => {
  const activeEntry = useTimeStore((state) => state.activeEntry);
  const updateEntry = useTimeStore(state => state.updateEntry);
  const deleteEntry = useTimeStore(state => state.deleteEntry);
  const { hours, minutes } = useActiveSessionTime(activeEntry?.start ?? null);
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);

  function formatLocalDateTime(date) {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleCancel = async () => {
    if (confirm('Cancel and delete this entry?')) {
      await deleteEntry(activeEntry.id);
      setActiveEntry(null);
    }
  }

  const handleClockOut = async () => {
    const clockOutDate = new Date();

    const formData = new FormData();
    formData.set('id', activeEntry.id);
    formData.set('startDate', formatLocalDateTime(activeEntry.start));
    formData.set('endDate', formatLocalDateTime(clockOutDate));

    await updateEntry(Object.fromEntries(formData.entries()));
    setActiveEntry(null);
  }

  return (
    <motion.div
      key="clock-in"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.50 }}
    >
      <div className="mb-3" style={{ display: "flex", alignItems: "center" }}>
        <i className="fa fa-solid fa-clock" style={{ fontSize: "36px", marginRight: "10px" }}></i>
        <div>
          <div>You are clocked in since: <span className="bold">{activeEntry.start.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}</span></div>
          <div>Elasped time: <span className="bold">{hours}h {minutes}m</span></div>
        </div>
      </div>

      <div className="mt-3" style={{ textAlign: 'center' }}>
        <button type="button" disabled={activeEntry === null} className="btn btn-success" onClick={handleClockOut}>
          Clock Out
        </button>
        <button type="button" className="btn btn-outline-success ms-3" onClick={handleCancel}>Cancel</button>
      </div>
    </motion.div>
  )
}

export default ClockedInPanel;