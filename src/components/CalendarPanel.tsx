import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DateNull } from "../types";
import '../App.css';
import { useTimeStore, useCompanyStore } from '../hooks';
import { startOfWeek, endOfWeek } from "date-fns";


const CalendarPanel = () => {
  const [dateRange, setDateRange] = useState<DateNull>({start: new Date(), end: new Date()});
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  const activeCompany = useCompanyStore(state => state.activeCompany);

  const handleChange = (dates: [DateNull, DateNull]) => {
    const [start, end] = dates;
    setDateRange({start, end});
  };

  const selectFullWeek = () => {
    if (!dateRange.start) return;

    const start = startOfWeek(dateRange.start, { weekStartsOn: 0 });
    const end = endOfWeek(dateRange.end || dateRange.start, { weekStartsOn: 0 });

    setDateRange({start, end});
  };

  const selectToday = () => {
    const start = new Date();
    const end = new Date();

    setDateRange({start, end});
  };

  useEffect(() => {
    if(activeCompany)
      refreshTimeEntries({ newStart: dateRange.start, newEnd: dateRange.end, company: activeCompany });
  }, [dateRange, activeCompany]);

  return (
    <div className="calendar-panel-container">
      <div className="select-date">
        Select Date:
      </div>
      <DatePicker
        selected={dateRange.start}
        onChange={handleChange}
        startDate={dateRange.start}
        endDate={dateRange.end}
        inline
        selectsRange
      />
      <div className="mb-2">
        <button className="btn btn-secondary p-1 m-1" onClick={selectFullWeek}>
          Week
        </button>
        <button className="btn btn-secondary p-1 m-1" onClick={selectToday}>
          Today
        </button>
      </div>
    </div>
  );
}

export default CalendarPanel;
