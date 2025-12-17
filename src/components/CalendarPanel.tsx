import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DateValue } from "../types";
import '../App.css';
import { useTimeStore } from '../hooks/useTimeStore.js';


function CalendarPanel() {
  const [startDate, setStartDate] = useState<DateValue>(new Date());
  const [endDate, setEndDate] = useState<DateValue>(new Date());
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);

  const handleChange = (dates: [DateValue, DateValue]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if(!start || !end) {
      return;
    }
    refreshTimeEntries(start, end);
  };

  return (
    <>
      <div>
        <DatePicker
          selected={startDate}
          onChange={handleChange}
          startDate={startDate}
          endDate={endDate}
          inline
          selectsRange
        />
      </div>
      <div className="selection-total-container">
        Selection Total:
      </div>
    </>
  );
}

export default CalendarPanel;
