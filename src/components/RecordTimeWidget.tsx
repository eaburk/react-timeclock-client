import '../App.css';
import { useTimeStore, useCompanyStore, useActiveSessionTime } from '../hooks';
import { motion } from "framer-motion";
import ResumeEntryPanel from './ResumeEntryPanel';

const RecordTimeWidget = () => {

  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const activeEntry = useTimeStore((state) => state.activeEntry);
  const createEntry = useTimeStore(state => state.createEntry);
  const activeCompany = useCompanyStore(state => state.activeCompany);
  const updateEntry = useTimeStore(state => state.updateEntry);
  const deleteEntry = useTimeStore(state => state.deleteEntry);

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

    setActiveEntry(newEntry);
  }

  const { hours, minutes } = useActiveSessionTime(activeEntry?.start ?? null);

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
      deleteEntry(activeEntry.id);
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
    <div className="active-entry">
      <div className="title">
        <i className="fa fa-user"></i>
        <span className="ms-3">
          {activeEntry ? "Currently Clocked In" : "Not clocked in"}
        </span>
      </div>
      <div className="content">
        {!activeEntry &&
          <motion.div
            key="clocked-in"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.75 }}
          >
            <ResumeEntryPanel />

            <p style={{ textAlign: 'center' }}>
              You are not currently clocked in.<br />
              Start tracking your time with the button below.
            </p>
            <div style={{ textAlign: 'center' }}>
              <button type="button" className="btn btn-success" onClick={handleClockIn}>
                Clock In
              </button>
            </div>
          </motion.div>
        }
        {activeEntry &&
          <motion.div
            key="clock-in"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.75 }}
          >
            <div className="mb-3" style={{ textAlign: 'center' }}><i className="fa fa-solid fa-clock" style={{ fontSize: "64px" }}></i></div>
            <div>
              You are clocked in since: <span className="bold">{activeEntry.start.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div>
              Elasped time: <span className="bold">{hours}h {minutes}m</span>
            </div>
            <div className="mt-3" style={{ textAlign: 'center' }}>
              <button type="button" disabled={activeEntry === null} className="btn btn-success" onClick={handleClockOut}>
                Clock Out
              </button>
              <button type="button" className="btn btn-outline-success ms-3" onClick={handleCancel}>Cancel</button>
            </div>
          </motion.div>
        }
      </div>
    </div>
  );
}

export default RecordTimeWidget;

