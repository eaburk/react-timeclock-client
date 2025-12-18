import { useState } from "react";
import DatePicker from "react-datepicker";
import { TotalTime } from "../components";
import "react-datepicker/dist/react-datepicker.css";
import type { DateNull } from "../types";
import '../App.css';
import { useTimeStore } from '../hooks';


const CalendarPanel = () => {
  const [startDate, setStartDate] = useState<DateNull>(new Date());
  const [endDate, setEndDate] = useState<DateNull>(new Date());
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);

  const handleChange = (dates: [DateNull, DateNull]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if(!start || !end) {
      return;
    }
    refreshTimeEntries(start, end);
  };

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        inline
        selectsRange
      />
      <TotalTime />
    </div>
  );
}

export default CalendarPanel;
