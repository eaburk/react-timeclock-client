import '../App.css';
import { useTimeStore } from '../hooks';
import { useNow } from '../hooks';
import { isSameDay } from '../utilities';

function ProgressWidget({ basedHours, label, entries }) {
  const overallHours = basedHours * 60;
  const activeEntry = useTimeStore((state) => state.activeEntry);
  const currentClockIn = activeEntry ? new Date(activeEntry?.startDate) : null;
  const now = useNow(1000);

  const today = new Date();
  const completedMinutesToday = 
    entries.reduce( (total, { durationMinutes }) => total + durationMinutes, 0);

  const currentSessionMinutes = currentClockIn
    ? Math.max(0, (now - currentClockIn.getTime()) / 60000)
    : 0;

  const minutesWorked = Math.floor(
    completedMinutesToday + currentSessionMinutes
  );

  const progress = Math.min(
    (minutesWorked / overallHours) * 100,
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
          {label} Progress: {hours}h {minutes}m of {basedHours}h
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


