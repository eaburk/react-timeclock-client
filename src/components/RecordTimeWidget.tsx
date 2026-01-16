import '../App.css';
import { useTimeStore } from '../hooks';
import ClockInPanel from './ClockInPanel';
import ClockedInPanel from './ClockedInPanel';

const RecordTimeWidget = () => {
  const activeEntry = useTimeStore((state) => state.activeEntry);

  return (
    <div className="active-entry">
      <div className="title">
        <i className="fa fa-user"></i>
        <span className="ms-3">
          {activeEntry ? "Currently Clocked In" : "Not clocked in"}
        </span>
      </div>
      <div className="content">
        {!activeEntry && <ClockInPanel />}
        {activeEntry && <ClockedInPanel />}
      </div>
    </div>
  );
}

export default RecordTimeWidget;

