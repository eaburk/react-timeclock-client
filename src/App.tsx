// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import CalendarPanel from './components/CalendarPanel';
import MainContentPanel from './components/MainContentPanel';
import ProgressWidget from './components/ProgressWidget';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <div className="spa-container">
        <div className="main-content-panel">
        <MainContentPanel />
        </div>
        <div className="sidebar-panel">
          <CalendarPanel />
        </div>
      </div>
      <ProgressWidget />
    </>
  )
}

export default App
