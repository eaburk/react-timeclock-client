// This component is completely AI generated. Read and Modify at your own peril. It may make your brain hurt. You have been warned!
// However, it works and it took me one hour to do instead of several days to build it myself and properly organize the code.
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Spinner, Table, Form, Row, Col, ButtonGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useTimeReportStore } from '../hooks/useTimeReportStore';
import 'react-datepicker/dist/react-datepicker.css';
import { useCompanyStore } from '../hooks';

type ReportAveragesModalProps = {
  show: boolean;
  handleClose: () => void;
};

type DailySummary = {
  date: string;
  hours: number;
};

type WeeklySummary = {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  days: DailySummary[];
};

const ReportAveragesModal: React.FC<ReportAveragesModalProps> = ({ show, handleClose }) => {
  const { reportEntries, reportStart, reportEnd, isReportLoading, refreshReportEntries, setReportDates } = useTimeReportStore();
  const activeCompany = useCompanyStore(state => state.activeCompany);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  // Fetch data whenever dates change or when the modal opens
  useEffect(() => {
    if (show) {
      refreshReportEntries();
    }
  }, [reportStart, reportEnd, show]);

  // ==========================================
  // NAVIGATION HANDLERS
  // ==========================================
  const handleShiftMonth = (direction: 'prev' | 'next') => {
    const targetDate = new Date(reportStart);
    const currentMonth = targetDate.getMonth();

    targetDate.setMonth(
      direction === 'prev' ? currentMonth - 1 : currentMonth + 1
    );

    const start = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const end = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    setReportDates(start, end);

    // Collapse any expanded weeks when changing months
    setExpandedWeeks(new Set());
  };

  const handleSetAllTime = () => {
    const start = new Date(0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    setReportDates(start, end);
    setExpandedWeeks(new Set());
  };

  const handleSetThisMonth = () => {
    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    setReportDates(start, end);
    setExpandedWeeks(new Set());
  };

  const isAllTimeActive = reportStart.getTime() === 0;

  // ==========================================
  // CURRENT REPORT PERIOD
  // ==========================================
  const reportPeriod = isAllTimeActive
    ? 'All Time'
    : reportStart.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
      });

  // ==========================================
  // DATA PROCESSING
  // ==========================================
  const reportMetrics = useMemo(() => {
    if (!reportEntries.length) {
      return {
        weeklySummaries: [] as WeeklySummary[],
        weeklyAverageHours: 0,
        periodAverageHours: 0,
        totalHours: 0
      };
    }

    // ------------------------------------------
    // Group minutes by day
    // ------------------------------------------
    const minutesByDay: Record<string, number> = {};

    reportEntries.forEach((entry) => {
      const dateKey = new Date(entry.startDate)
        .toISOString()
        .split('T')[0];

      minutesByDay[dateKey] =
        (minutesByDay[dateKey] || 0) + entry.durationMinutes;
    });

    const dailySummaries: DailySummary[] = Object.entries(minutesByDay)
      .map(([date, minutes]) => ({
        date,
        hours: minutes / 60
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // ------------------------------------------
    // Total hours
    // ------------------------------------------
    const totalMinutes = reportEntries.reduce(
      (sum, entry) => sum + entry.durationMinutes,
      0
    );

    const totalHours = totalMinutes / 60;

    // ------------------------------------------
    // Daily average
    // Only days containing logs are counted
    // ------------------------------------------
    const activeDaysCount = dailySummaries.length;

    const periodAverageHours =
      activeDaysCount > 0 ? totalHours / activeDaysCount : 0;

    // ------------------------------------------
    // Group days into weeks
    // ------------------------------------------
    const weeks: Record<string, WeeklySummary> = {};

    dailySummaries.forEach(({ date, hours }) => {
      const dateObj = new Date(date + 'T00:00:00');

      // Sunday is the beginning of the week
      const weekStart = new Date(dateObj);

      weekStart.setDate(
        dateObj.getDate() - dateObj.getDay()
      );

      const weekEnd = new Date(weekStart);

      weekEnd.setDate(weekStart.getDate() + 6);

      const weekStartKey = weekStart
        .toISOString()
        .split('T')[0];

      if (!weeks[weekStartKey]) {
        weeks[weekStartKey] = {
          weekStart: weekStartKey,
          weekEnd: weekEnd.toISOString().split('T')[0],
          totalHours: 0,
          days: []
        };
      }

      weeks[weekStartKey].totalHours += hours;

      weeks[weekStartKey].days.push({
        date,
        hours
      });
    });

    const weeklySummaries = Object.values(weeks)
      .sort((a, b) =>
        b.weekStart.localeCompare(a.weekStart)
      )
      .map((week) => ({
        ...week,
        days: week.days.sort((a, b) =>
          a.date.localeCompare(b.date)
        )
      }));

    // ------------------------------------------
    // Weekly average
    // Only weeks containing logs are counted
    // ------------------------------------------
    const activeWeeksCount = weeklySummaries.length;

    const weeklyAverageHours =
      activeWeeksCount > 0
        ? totalHours / activeWeeksCount
        : 0;

    return {
      weeklySummaries,
      weeklyAverageHours,
      periodAverageHours,
      totalHours
    };
  }, [reportEntries]);

  const {
    weeklySummaries,
    weeklyAverageHours,
    periodAverageHours,
    totalHours
  } = reportMetrics;

  // ==========================================
  // WEEK EXPANSION
  // ==========================================
  const toggleWeek = (weekStart: string) => {
    setExpandedWeeks((current) => {
      const next = new Set(current);

      if (next.has(weekStart)) {
        next.delete(weekStart);
      } else {
        next.add(weekStart);
      }

      return next;
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{activeCompany?.description} Time Report Breakdown</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* ==========================================
            DATE SELECTION
            ========================================== */}
        <Form className="mb-4 bg-light p-3 rounded border">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleShiftMonth('prev')}
              disabled={isAllTimeActive}
            >
              &#x25C0;&#xFE0E; Prev Month
            </Button>

            <div className="text-center flex-grow-1">
              <div className="fs-5 fw-semibold">
                {reportPeriod}
              </div>
            </div>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleShiftMonth('next')}
              disabled={isAllTimeActive}
            >
              Next Month &#x25B6;&#xFE0E;
            </Button>
          </div>

          <div className="d-flex justify-content-center mb-3">
            <ButtonGroup size="sm">
              <Button
                variant={
                  isAllTimeActive
                    ? 'secondary'
                    : 'outline-secondary'
                }
                onClick={handleSetAllTime}
              >
                All Time
              </Button>

              <Button
                variant="outline-secondary"
                onClick={handleSetThisMonth}
              >
                Current Month
              </Button>
            </ButtonGroup>
          </div>

          <Row className="align-items-end">
            <Col
              md={6}
              sm={12}
              className="mb-2 mb-md-0"
            >
              <Form.Group>
                <Form.Label className="small fw-bold text-muted">
                  Start Date
                </Form.Label>

                <DatePicker
                  selected={
                    isAllTimeActive
                      ? null
                      : reportStart
                  }
                  placeholderText="Beginning of Time"
                  dateFormat="MM/dd/yyyy"
                  onChange={(date) => {
                    if (date) {
                      date.setHours(
                        0,
                        0,
                        0,
                        0
                      );

                      setReportDates(
                        date,
                        reportEnd
                      );

                      setExpandedWeeks(new Set());
                    }
                  }}
                  customInput={
                    <Form.Control
                      style={{
                        cursor: 'pointer'
                      }}
                    />
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6} sm={12}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted">
                  End Date
                </Form.Label>

                <DatePicker
                  selected={reportEnd}
                  dateFormat="MM/dd/yyyy"
                  minDate={
                    isAllTimeActive
                      ? undefined
                      : reportStart
                  }
                  onChange={(date) => {
                    if (date) {
                      date.setHours(
                        23,
                        59,
                        59,
                        999
                      );

                      setReportDates(
                        reportStart,
                        date
                      );

                      setExpandedWeeks(new Set());
                    }
                  }}
                  customInput={
                    <Form.Control
                      style={{
                        cursor: 'pointer'
                      }}
                    />
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* ==========================================
            REPORT CONTENT
            ========================================== */}
        {isReportLoading ? (
          <div className="text-center p-4">
            <Spinner
              animation="border"
              role="status"
            />

            <p className="mt-2 text-muted">
              Analyzing time logs...
            </p>
          </div>
        ) : (
          <div>
            {/* ==========================================
                SUMMARY CARDS
                ========================================== */}
            <div className="d-flex justify-content-around mb-4 bg-light p-3 rounded border border-secondary-subtle">
              <div className="text-center">
                <span className="text-muted d-block small fw-bold">
                  Total Time
                </span>

                <strong className="fs-4 text-dark">
                  {totalHours.toFixed(1)} hrs
                </strong>
              </div>

              <div className="border-end"></div>

              <div className="text-center">
                <span className="text-muted d-block small fw-bold">
                  Weekly Average (Active Weeks)
                </span>

                <strong className="fs-4 text-primary">
                  {weeklyAverageHours.toFixed(2)} hrs/wk
                </strong>
              </div>

              <div className="border-end"></div>

              <div className="text-center">
                <span className="text-muted d-block small">
                  Daily Average (Active Days Only)
                </span>

                <strong className="fs-4 text-success">
                  {periodAverageHours.toFixed(2)} hrs/day
                </strong>
              </div>
            </div>

            {/* ==========================================
                WEEKLY SUMMARY
                ========================================== */}
            <h5 className="mb-3">
              Weekly Summary
            </h5>

            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto'
              }}
              className="border rounded"
            >
              <Table
                striped
                bordered
                hover
                size="sm"
                className="mb-0"
              >
                <thead
                  className="sticky-top bg-white shadow-sm"
                  style={{ zIndex: 1 }}
                >
                  <tr>
                    <th
                      style={{
                        width: '45px'
                      }}
                    ></th>

                    <th>Week</th>

                    <th className="text-end">
                      Hours
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {weeklySummaries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-muted p-4"
                      >
                        No entries found for
                        this time period.
                      </td>
                    </tr>
                  ) : (
                    weeklySummaries.map((week) => {
                      const isExpanded =
                        expandedWeeks.has(
                          week.weekStart
                        );

                      const weekStart =
                        new Date(
                          week.weekStart +
                            'T00:00:00'
                        );

                      const weekEnd =
                        new Date(
                          week.weekEnd +
                            'T00:00:00'
                        );

                      return (
                        <React.Fragment
                          key={week.weekStart}
                        >
                          <tr
                            onClick={() =>
                              toggleWeek(
                                week.weekStart
                              )
                            }
                            style={{
                              cursor: 'pointer'
                            }}
                          >
                            <td className="text-center"> {isExpanded ? '▼\uFE0E' : '▶\uFE0E'} </td>
                            <td className="fw-semibold">
                              {weekStart.toLocaleDateString(
                                undefined,
                                {
                                  month: 'short',
                                  day: 'numeric'
                                }
                              )}

                              {' – '}

                              {weekEnd.toLocaleDateString(
                                undefined,
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                }
                              )}
                            </td>

                            <td className="text-end fw-semibold">
                              {week.totalHours.toFixed(
                                2
                              )}{' '}
                              hrs
                            </td>
                          </tr>

                          {isExpanded &&
                            week.days.map(
                              (day) => (
                                <tr
                                  key={
                                    day.date
                                  }
                                  className="table-light"
                                >
                                  <td></td>

                                  <td className="ps-4 text-muted">
                                    {new Date(
                                      day.date +
                                        'T00:00:00'
                                    ).toLocaleDateString(
                                      undefined,
                                      {
                                        weekday:
                                          'short',
                                        month:
                                          'short',
                                        day: 'numeric'
                                      }
                                    )}
                                  </td>

                                  <td className="text-end text-muted">
                                    {day.hours.toFixed(
                                      2
                                    )}{' '}
                                    hrs
                                  </td>
                                </tr>
                              )
                            )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportAveragesModal;