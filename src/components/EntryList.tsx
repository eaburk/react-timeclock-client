import { useEffect, useState, useRef, forwardRef } from "react";
import '../App.css';
import { useTimeStore, useCompanyStore, useActiveSessionTime } from '../hooks';
import type { TimeEntry } from '../types';
import { EditTimeModal, AddTimeModal, TotalTime } from '../components';
import { formatMinutes, toHHMM } from '../utilities';
import { startOfWeek, endOfWeek } from "date-fns";
import DatePicker from "react-datepicker";

const HiddenInput = forwardRef<HTMLInputElement, any>(
  ({ onClick }, ref) => (
    <input
      ref={ref}
      onClick={onClick}
      style={{ display: "none" }}
      readOnly
    />
  )
);

const EntryList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const timeEntries = useTimeStore((state) => state.entries);
  const refreshTimeEntries = useTimeStore((state) => state.refreshEntries);
  const deleteEntry = useTimeStore((state) => state.deleteEntry);
  const setActiveEntry = useTimeStore((state) => state.setActiveEntry);
  const activeEntry = useTimeStore((state) => state.activeEntry);
  const activeCompany = useCompanyStore(state => state.activeCompany);
  const updateEntry = useTimeStore(state => state.updateEntry);
  const filterStart = useTimeStore(state => state.filterStart);
  const filterEnd = useTimeStore(state => state.filterEnd);
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = range;
  const [open, setOpen] = useState(false);

  const { totalMinutes } = useActiveSessionTime(activeEntry?.start ?? null);

  useEffect(() => {
    if(activeCompany) {
      refreshTimeEntries({ company: activeCompany });
    }
  }, [activeCompany])

  const handleEditEntry = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleDeleteEntry = async (timeEntry: TimeEntry) => {
    if(confirm('Are you sure?')) {
      await deleteEntry(timeEntry.id);
      setActiveEntry(null);
    }
  }

  const handleResumeEntry = (timeEntry: TimeEntry) => {
    setActiveEntry(timeEntry);
  }

  const handleChangeBilled = async (event, timeEntry) => {
    const payload = { id: timeEntry.id, startDate: timeEntry.startDate, endDate: timeEntry.endDate, billed: event.currentTarget.checked ? "1" : "0" }
    await updateEntry(payload);
  }

  const allBilled = timeEntries.every(e => (e.billed == "1"));
  const handleBillAll = () => {
    timeEntries.forEach(timeEntry => {
      const payload = { id: timeEntry.id, startDate: timeEntry.startDate, endDate: timeEntry.endDate, billed: allBilled ? "0" : "1" }
      updateEntry(payload);
    });
  }

  const selectFullWeek = () => {
    if (!filterStart) return;

    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const end = endOfWeek(new Date(), { weekStartsOn: 0 });

    refreshTimeEntries({ newStart: start, newEnd: end, company: activeCompany });
  };

  const selectToday = () => {
    const start = new Date();
    const end = new Date();

    refreshTimeEntries({ newStart: start, newEnd: end, company: activeCompany });
  };

  const isToday = () => {
    return filterStart.toDateString() === (new Date()).toDateString()
      && filterEnd.toDateString() === (new Date()).toDateString();
  }

  const isWeek = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const end = endOfWeek(new Date(), { weekStartsOn: 0 });
    return filterStart.toDateString() === start.toDateString() && filterEnd.toDateString() === end.toDateString();
  }

  const handleAddEntry = () => {
    setShowAddModal(true);
  }

  const containerRef = useRef(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    setShowMore(timeEntries.length > 4);
  }, [timeEntries])

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // Use a 1px threshold to account for sub-pixel precision in modern browsers
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 1;

      if (isAtBottom) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
    }
  };

  const scrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: 300, // Scrolls down 300 pixels
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const customDateTitle = startDate && endDate
              ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              : ""

  return (
    <div className="time-entry-line-container">
      <div className="time-entry-title">Time Entries</div>
      <div className="entry-list-action-bar">
        <button title="Mark/Unmark billed status for the entries in the list" type="button" onClick={handleBillAll} className="btn btn-secondary me-1">Toggle Billed</button>
        <button className="btn btn-primary me-5" onClick={handleAddEntry}>
          <i className="fa fa-plus"></i> Add Entry
        </button>
        <div className="filters-container">
          <button className={`filter-button ${isWeek() ? " active" : ""}`} onClick={selectFullWeek}>
            Current&nbsp;Week
          </button>
          <button className={`filter-button ${isToday() ? " active" : ""}`} onClick={selectToday}>
            Today
          </button>

          <button onClick={() => setOpen(true)} className={`filter-button ${!isToday() && !isWeek() ? " active" : ""}`}>
            <span title={customDateTitle}>
              Custom
            </span>
          </button>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={async (update) => {
              if(update[1]){
                refreshTimeEntries({ newStart: update[0], newEnd: update[1], company: activeCompany });
              }
              setRange(update);
              if (update[0] && update[1]) {
                setOpen(false);
              }
            }}
            open={open}
            onClickOutside={() => setOpen(false)}
            customInput={<HiddenInput />}
          />
        </div>
      </div>
      <TotalTime />
      <div className="entries-table-container"  onScroll={handleScroll} ref={containerRef}>
        <table className="entry-list-table table table-striped" style={{width: "100%"}}>
          <thead>
            <tr>
              <th></th>
              <th>Billed</th>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Total Time</th>
            </tr>
          </thead>
          <tbody>
            {timeEntries.length === 0 && <tr><td colSpan={6}>No Entries</td></tr>}
            {timeEntries.map(timeEntry => (
              <tr key={timeEntry.id}>
                <td>
                  <button title="Edit Entry" type="button" onClick={() => handleEditEntry(timeEntry)} className="normal mx-2">📝</button>
                  <button title="Delete Entry" type="button" onClick={() => handleDeleteEntry(timeEntry)} className="normal mx-2">❌</button>
                </td>
                <td>
                  <input type="checkbox" onChange={(event) => handleChangeBilled(event, timeEntry)} checked={timeEntry.billed === 1} />
                </td>
                <td>
                  {timeEntry.start.toLocaleDateString()}
                </td>
                <td>
                  {toHHMM(timeEntry.start)}
                </td>
                <td>
                  {timeEntry.endDate !== '' && toHHMM(timeEntry.end)}
                  {timeEntry.endDate === '' && timeEntry.id !== activeEntry?.id && <button onClick={() => handleResumeEntry(timeEntry)} className='btn btn-link'>Resume</button>}
                  {timeEntry.endDate === '' && timeEntry.id === activeEntry?.id && <div className='btn btn-link'>In Progress</div>}
                </td>
                <td>
                  {timeEntry.endDate !== '' && formatMinutes(timeEntry.durationMinutes)}
                  {timeEntry.endDate === '' && timeEntry.id === activeEntry?.id && <div className='btn btn-link'>{formatMinutes(totalMinutes)}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showMore &&
        <div className="show-more-container mt-2">
          <div className="show-more-inner-container" onClick={scrollDown}>
            <i className="fa fa-chevron-down ms-2"></i>
          </div>
        </div>

      }
      <EditTimeModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        entryToEdit={selectedEntry}
      />
      <AddTimeModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />
    </div>
  );
}

export default EntryList;
