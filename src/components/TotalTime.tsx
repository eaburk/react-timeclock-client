import '../App.css';
import { useTimeStore } from '../hooks';

const TotalTime = () => {
  const totalMinutes = useTimeStore((state) =>
     state.entries.reduce((sum, entry) => sum + entry.durationMinutes, 0)
   )
   
   const hours = Math.floor(totalMinutes / 60)
   const minutes = totalMinutes % 60

   return (
     <div className="total-time">
       Selection Total: {hours}h {minutes}m
     </div>
   )
}

export default TotalTime;

