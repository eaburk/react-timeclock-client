import '../App.css';
import { RecordTimeWidget } from './';
import EntryList from './EntryList';

const MainContentPanel = () => {


  return (
    <div className="main-content-container">
      <RecordTimeWidget />
      <EntryList />
    </div>
  );
}

export default MainContentPanel;
