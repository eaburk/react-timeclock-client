// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import  { MainContentPanel } from './components';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="spa-container">
      <div className="main-content-panel">
        <MainContentPanel />
      </div>
    </div>
  )
}

export default App
