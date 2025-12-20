// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import  { CalendarPanel, MainContentPanel, ProgressWidget } from './components';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="spa-container">
      <div className="main-content-panel">
        <MainContentPanel />
        <div className="mt-3">
          <ProgressWidget />
        </div>
      </div>
      <div className="sidebar-panel">
        <CalendarPanel />
      </div>
    </div>
  )
}

export default App
