import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CreativeInput from '../components/CreativeInput/CreativeInput';
import useLocalStorage from '../hooks/useLocalStorage'; // Assuming you have this hook
import '../styles/Monthly.css';

const MonthlyPlanner = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentMonthKey = format(currentDate, 'MMMM-yyyy'); // Unique key per month-year

    const [monthlyData, setMonthlyData] = useLocalStorage(`monthly_data_${currentMonthKey}`, {
        focus: '',
        dates: '',
        notes: ''
    });

    const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

    const handleChange = (field, value) => {
        setMonthlyData({ ...monthlyData, [field]: value });
    };

    return (
        <div className="monthly-page fade-in">
            <header className="monthly-header">
                <div className="month-navigation">
                    <button onClick={handlePrevMonth} className="nav-btn"><ChevronLeft size={24} /></button>
                    <h1>Hello, {format(currentDate, 'MMMM')}.</h1>
                    <button onClick={handleNextMonth} className="nav-btn"><ChevronRight size={24} /></button>
                </div>
                <p className="monthly-quote">“Every month brings a fresh rhythm.”</p>
                <div className="year-label">{format(currentDate, 'yyyy')}</div>
            </header>

            <div className="monthly-grid">
                <section className="monthly-section focus-section">
                    <h2>Monthly Focus</h2>
                    <CreativeInput
                        id={`monthly_focus_${currentMonthKey}`}
                        placeholder="What is your main intention this month?"
                        value={monthlyData.focus}
                        onChange={(val) => handleChange('focus', val)}
                    />
                </section>

                <section className="monthly-section dates-section">
                    <h2>Important Dates</h2>
                    <CreativeInput
                        id={`monthly_dates_${currentMonthKey}`}
                        placeholder="Birthdays, deadlines, events..."
                        value={monthlyData.dates}
                        onChange={(val) => handleChange('dates', val)}
                    />
                </section>

                <section className="monthly-section notes-section">
                    <h2>Notes & Ideas</h2>
                    <CreativeInput
                        id={`monthly_notes_${currentMonthKey}`}
                        placeholder="Anything else on your mind..."
                        value={monthlyData.notes}
                        onChange={(val) => handleChange('notes', val)}
                    />
                </section>
            </div>
        </div>
    );
};

export default MonthlyPlanner;
