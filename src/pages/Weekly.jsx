import React, { useState } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CreativeInput from '../components/CreativeInput/CreativeInput';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/Weekly.css';

const WeeklyPlanner = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [weeklyData, setWeeklyData] = useLocalStorage(`weekly_${format(currentWeekStart, 'yyyy-MM-dd')}`, {
        intention: '',
        priorities: ['', '', ''],
        selfCare: '',
        days: Array(7).fill('')
    });

    const handlePrevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
    const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));

    const handlePriorityChange = (index, value) => {
        const newPriorities = [...weeklyData.priorities];
        newPriorities[index] = value;
        setWeeklyData({ ...weeklyData, priorities: newPriorities });
    };

    const handleDayChange = (index, value) => {
        const newDays = [...weeklyData.days];
        newDays[index] = value;
        setWeeklyData({ ...weeklyData, days: newDays });
    };

    const weekKey = format(currentWeekStart, 'yyyy-MM-dd');
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

    return (
        <div className="weekly-page fade-in">
            <header className="weekly-header">
                <p className="weekly-quote">“Plan softly. Live fully.”</p>
                <div className="week-navigation">
                    <button onClick={handlePrevWeek} className="nav-btn"><ChevronLeft size={20} /></button>
                    <div className="week-range">
                        {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
                    </div>
                    <button onClick={handleNextWeek} className="nav-btn"><ChevronRight size={20} /></button>
                </div>
            </header>

            <div className="top-section">
                <div className="card intention-card">
                    <h3>Weekly Intention</h3>
                    <CreativeInput
                        id={`weekly_intention_${weekKey}`}
                        placeholder="How do you want to feel this week?"
                        value={weeklyData.intention}
                        onChange={(val) => setWeeklyData({ ...weeklyData, intention: val })}
                    />
                </div>
                <div className="card priorities-card">
                    <h3>Top 3 Priorities</h3>
                    {weeklyData.priorities.map((p, i) => (
                        <CreativeInput
                            key={i}
                            id={`weekly_priority_${i}_${weekKey}`}
                            placeholder={`Priority ${i + 1}`}
                            value={p}
                            onChange={(val) => handlePriorityChange(i, val)}
                            className="mb-small"
                        />
                    ))}
                </div>
                <div className="card selfcare-card">
                    <h3>Self-Care Focus</h3>
                    <CreativeInput
                        id={`weekly_selfcare_${weekKey}`}
                        placeholder="How will you rest?"
                        value={weeklyData.selfCare}
                        onChange={(val) => setWeeklyData({ ...weeklyData, selfCare: val })}
                    />
                </div>
            </div>

            <div className="week-grid">
                {weekDays.map((day, index) => (
                    <div key={index} className="day-column">
                        <div className="day-header">
                            <span className="day-name">{format(day, 'EEEE')}</span>
                            <span className="day-date">{format(day, 'd')}</span>
                        </div>
                        <div className="day-content">
                            <CreativeInput
                                id={`weekly_day_${index}_${weekKey}`}
                                placeholder="..."
                                value={weeklyData.days[index]}
                                onChange={(val) => handleDayChange(index, val)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyPlanner;
