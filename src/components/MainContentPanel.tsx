import '../App.css';
import CompanySelection from './CompanySelection';
import { RecordTimeWidget, CalendarPanel, ProgressWidget } from './';
import EntryList from './EntryList';
import { useTimeStore } from '../hooks';
import { isSameDay } from '../utilities';

const MainContentPanel = () => {
  const weekEntries = useTimeStore(state => state.weekEntries);

  const today = new Date();
  const todayEntries = weekEntries
    .filter(entry =>
      entry.startDate &&
      entry.startDate &&
      entry.endDate !== "" &&
      isSameDay(entry.start, today)
    );

  return (
    <div className="main-content-container">
      <div className="main-content-inner-container">
        <div>
          <CompanySelection />
          <RecordTimeWidget />
        </div>
        <div>
          <CalendarPanel />
        </div>
      </div>
      <div className="mt-3 p-2">
          <EntryList />
        <ProgressWidget label={"Today's"} basedHours={8} entries={todayEntries} />
        <ProgressWidget label={"Week's"} basedHours={40} entries={weekEntries} />
      </div>
    </div>
  );
}

export default MainContentPanel;
