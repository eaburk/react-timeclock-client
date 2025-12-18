import '../App.css';
import { useTimeStore } from '../hooks';
import { useNow } from '../hooks';
import { isSameDay } from '../utilities';

const EIGHT_HOURS_MINUTES = 8 * 60
function ProgressWidget() {
  const currentClockIn = useTimeStore((state) => state.currentClockIn);
  const timeEntries = useTimeStore((state) => state.entries);
  const now = useNow(1000);


  const today = new Date();

  const completedMinutesToday = timeEntries
    .filter(entry =>
      entry.startDate &&
      entry.startDate &&
      isSameDay(entry.start, today)
    )
    .reduce((total, entry) => {
      const minutes =
        (entry.end.getTime() - entry.start.getTime()) / 60000;
      return total + minutes;
    }, 0);

  const currentSessionMinutes = currentClockIn
    ? Math.max(0, (now - currentClockIn.getTime()) / 60000)
    : 0;

  const minutesWorked = Math.floor(
    completedMinutesToday + currentSessionMinutes
  );

  const progress = Math.min(
    (minutesWorked / EIGHT_HOURS_MINUTES) * 100,
    100
  );

  let hours = Math.floor(minutesWorked / 60)
  let minutes = minutesWorked % 60

  // when first clocking in, values might be negative
  hours = hours >= 0 ? hours : 0;
  minutes = minutes >= 0 ? minutes : 0;

  return (
    <div className="progress-widget-container">
      <div className="progress-wrapper">
        <div className="label">
          Today's Progress: {hours}h {minutes}m of 8h
        </div>

        <div className="bar">
          <div
            className="fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProgressWidget;


