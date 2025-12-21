// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import  { CalendarPanel, MainContentPanel, ProgressWidget } from './components';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTimeStore } from './hooks';
import { isSameDay } from './utilities';

function App() {
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
    <div className="spa-container">
      <div className="main-content-panel">
        <MainContentPanel />
        <div className="mt-3">
          <ProgressWidget label={"Today's"} basedHours={8} entries={todayEntries} />
          <ProgressWidget label={"Week's"} basedHours={40} entries={weekEntries} />
        </div>
      </div>
      <div className="sidebar-panel">
        <CalendarPanel />
      </div>
    </div>
  )
}

export default App
