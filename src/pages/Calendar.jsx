import React, { useState } from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addYears, subYears } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icons
import { motion } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/Calendar.css';

import CreativeModal from '../components/CreativeInput/CreativeModal';

const YearlyCalendar = () => {
    const [events, setEvents] = useLocalStorage('calendar_events', {});
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date()); // State for year navigation

    const currentYear = currentDate.getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 0, 1));
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    const handlePrevYear = () => setCurrentDate(prev => subYears(prev, 1));
    const handleNextYear = () => setCurrentDate(prev => addYears(prev, 1));

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (content) => {
        if (!selectedDate) return;
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        if (!content || content.trim() === '') {
            const newEvents = { ...events };
            delete newEvents[dateStr];
            setEvents(newEvents);
        } else {
            setEvents({ ...events, [dateStr]: content });
        }
        setIsModalOpen(false);
    };

    const getInitialValue = () => {
        if (!selectedDate) return '';
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        return events[dateStr] || '';
    };

    return (
        <div className="calendar-page fade-in">
            <div className="calendar-header">
                <button onClick={handlePrevYear} className="nav-btn year-nav-btn"><ChevronLeft size={24} /></button>
                <div className="header-text">
                    <h1>The Year at a Glance</h1>
                    <p>{currentYear}</p>
                </div>
                <button onClick={handleNextYear} className="nav-btn year-nav-btn"><ChevronRight size={24} /></button>
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

            <CreativeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                initialValue={getInitialValue()}
                canvasId={selectedDate ? `calendar_${format(selectedDate, 'yyyy-MM-dd')}` : 'temp_calendar'}
            />
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
                    <div key={i} className="calendar-day-header">{d}</div>
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
