import '../App.css';
import { useTimeStore, useActiveSessionTime } from '../hooks';
import { formatMinutes } from '../utilities';

const TotalTime = () => {
  const activeEntry = useTimeStore(state => state.activeEntry);
  const { hours, minutes, totalMinutes } = useActiveSessionTime(activeEntry?.start ?? null);

  const totalRecordedMinutes = useTimeStore((state) =>
     state.entries.reduce((sum, entry) => sum + entry.durationMinutes, 0)
   )

   return (
     <div className="total-time p-2" style={{fontStyle: "italic"}}>
       Total time for selected range: <span className="bold">{formatMinutes(totalMinutes + totalRecordedMinutes)}</span>
     </div>
   )
}

export default TotalTime;
