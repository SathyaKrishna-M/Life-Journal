import React, { useState } from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/Calendar.css';

const YearlyCalendar = () => {
    const [events, setEvents] = useLocalStorage('calendar_events', {});
    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 0, 1));

    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    const handleDateClick = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const existingEvent = events[dateStr];

        // Simple prompt for now, could be a modal in V2
        const title = prompt("Add Event / Highlights:", existingEvent || "");

        if (title !== null) {
            if (title.trim() === "") {
                const newEvents = { ...events };
                delete newEvents[dateStr];
                setEvents(newEvents);
            } else {
                setEvents({ ...events, [dateStr]: title });
            }
        }
    };

    return (
        <div className="calendar-page fade-in">
            <div className="calendar-header">
                <h1>The Year at a Glance</h1>
                <p>{currentYear}</p>
            </div>

            <div className="year-grid">
                {months.map((month) => (
                    <MonthGrid
                        key={month.toString()}
                        month={month}
                        events={events}
                        onDateClick={handleDateClick}
                    />
                ))}
            </div>
        </div>
    );
};

const MonthGrid = ({ month, events, onDateClick }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Padding for start of month
    const startDay = monthStart.getDay(); // 0 is Sunday

    return (
        <motion.div
            className="month-card"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <h3 className="month-title">{format(month, 'MMMM')}</h3>
            <div className="days-grid">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="day-header">{d}</div>
                ))}

                {Array(startDay).fill(null).map((_, i) => (
                    <div key={`empty-${i}`} className="day-cell empty" />
                ))}

                {days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const hasEvent = !!events[dateStr];

                    return (
                        <div
                            key={day.toString()}
                            className={`day-cell ${hasEvent ? 'has-event' : ''}`}
                            onClick={() => onDateClick(day)}
                            title={events[dateStr] || format(day, 'MMM d')}
                        >
                            <span className="day-number">{format(day, 'd')}</span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default YearlyCalendar;
