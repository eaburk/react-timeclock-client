import '../App.css';
import { useTimeStore } from '../hooks/useTimeStore';
import { useNow } from '../hooks/useNow';

const EIGHT_HOURS_MINUTES = 8 * 60
function ProgressWidget() {
  const currentClockIn = useTimeStore((state) => state.currentClockIn);

  const now = useNow(1000);

  if(!currentClockIn) {
    return <div></div>;
  }

  const minutesWorked = Math.floor(
    (now - currentClockIn.getTime()) / 60000
  )

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


