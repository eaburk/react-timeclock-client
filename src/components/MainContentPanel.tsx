import '../App.css';
import { RecordTimeWidget, ProgressWidget } from './';
import EntryList from './EntryList';
import { useTimeStore } from '../hooks';
import { isSameDay } from '../utilities';
import ResumeEntryPanel from './ResumeEntryPanel';

const MainContentPanel = () => {
  const weekEntries = useTimeStore(state => state.weekEntries);

  const today = new Date();
  const todayEntries = weekEntries
    .filter(entry =>
      entry.startDate &&
      entry.endDate !== "" &&
      isSameDay(entry.start, today)
    );

  return (
      <div className="main-content-container">
        <div className="progress-bars-container">
          <div>
            <RecordTimeWidget />
          </div>
          <div>
            <ProgressWidget label={"Today's"} basedHours={8} entries={todayEntries} />
            <ProgressWidget label={"Week's"} basedHours={40} entries={weekEntries} />
            <ResumeEntryPanel />
          </div>
        </div>
        <EntryList />
      </div>
  );
}

export default MainContentPanel;
