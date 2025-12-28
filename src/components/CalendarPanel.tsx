import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DateNull } from "../types";
import '../App.css';
import { useTimeStore, useCompanyStore } from '../hooks';


const CalendarPanel = () => {
  const filterStart = useTimeStore((state) => (state.filterStart));
  const filterEnd = useTimeStore((state) => (state.filterEnd));
  const [dateRange, setDateRange] = useState<DateNull>({start: filterStart || new Date(), end: filterEnd || new Date()});
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  const activeCompany = useCompanyStore(state => state.activeCompany);

  const handleChange = (dates: [DateNull, DateNull]) => {
    const [start, end] = dates;
    setDateRange({start, end});
  };

  useEffect(() => {
    if(activeCompany && dateRange.end) {
      refreshTimeEntries({ newStart: dateRange.start, newEnd: dateRange.end, company: activeCompany });
    }
  }, [dateRange, activeCompany]);

  useEffect(() => {
    console.log(filterStart, filterEnd)
    setDateRange({start: filterStart, end: filterEnd});
  }, [filterStart, filterEnd]);

  return (
    <div className="calendar-panel-container">
      <div className="select-date">
        Filter Entries:
      </div>
      <DatePicker
        selected={dateRange.start}
        onChange={handleChange}
        startDate={dateRange.start}
        endDate={dateRange.end}
        inline
        selectsRange
      />
    </div>
  );
}

export default CalendarPanel;
