import { useTimeStore } from "../hooks";
import { isSameDay } from "../utilities";
import ProgressWidget from "./ProgressWidget";

const ProgessBarsWidget = () => {
  const weekEntries = useTimeStore(state => state.weekEntries);

  const today = new Date();
  const todayEntries = weekEntries
    .filter(entry =>
      entry.startDate &&
      entry.endDate !== "" &&
      isSameDay(entry.start, today)
    );
  return (
    <div className='progress-bar-container'>
      <ProgressWidget label={"Today's"} basedHours={8} entries={todayEntries} />
      <ProgressWidget label={"Week's"} basedHours={40} entries={weekEntries} />
    </div>
  )
}

export default ProgessBarsWidget;