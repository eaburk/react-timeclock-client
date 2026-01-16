import { useCompanyStore, useTimeStore } from '../hooks';
import ResumeEntryPanel from './ResumeEntryPanel';
import { motion } from "framer-motion";

const ClockInPanel = () => {
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const createEntry = useTimeStore(state => state.createEntry);
  const activeCompany = useCompanyStore(state => state.activeCompany);

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

  return (
    <motion.div
      key="clocked-in"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.50 }}
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
  )
}

export default ClockInPanel;