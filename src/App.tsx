// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import  { MainContentPanel, NavBar } from './components';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <>
      <NavBar />
      <div className="spa-container">
        <div className="main-content-panel">
          <MainContentPanel />
        </div>
      </div>
    </>
  )
}

export default App
