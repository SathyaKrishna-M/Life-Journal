import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import CreativeInput from '../components/CreativeInput/CreativeInput';
import useLocalStorage from '../hooks/useLocalStorage'; // Assuming you have this hook
import '../styles/Monthly.css';

const MonthlyPlanner = () => {
    const currentMonth = format(new Date(), 'MMMM');
    const [monthlyData, setMonthlyData] = useLocalStorage(`monthly_data_${currentMonth}`, {
        focus: '',
        dates: '',
        notes: ''
    });

    const handleChange = (field, value) => {
        setMonthlyData({ ...monthlyData, [field]: value });
    };

    return (
        <div className="monthly-page fade-in">
            <header className="monthly-header">
                <h1>Hello, {currentMonth}. Let’s begin.</h1>
                <p className="monthly-quote">“Every month brings a fresh rhythm.”</p>
            </header>

            <div className="monthly-grid">
                <section className="monthly-section focus-section">
                    <h2>Monthly Focus</h2>
                    <CreativeInput
                        placeholder="What is your main intention this month?"
                        value={monthlyData.focus}
                        onChange={(val) => handleChange('focus', val)}
                    />
                </section>

                <section className="monthly-section dates-section">
                    <h2>Important Dates</h2>
                    <CreativeInput
                        placeholder="Birthdays, deadlines, events..."
                        value={monthlyData.dates}
                        onChange={(val) => handleChange('dates', val)}
                    />
                </section>

                <section className="monthly-section notes-section">
                    <h2>Notes & Ideas</h2>
                    <CreativeInput
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
