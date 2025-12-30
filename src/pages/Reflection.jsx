import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CreativeInput from '../components/CreativeInput/CreativeInput';
import useLocalStorage from '../hooks/useLocalStorage';
import { format, subDays, startOfWeek, differenceInCalendarDays } from 'date-fns';
import { Calendar, Moon } from 'lucide-react';
import '../styles/Reflection.css';

const Reflection = () => {
    const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'daily'
    const [pastEntries, setPastEntries] = useState([]);

    const currentMonth = format(new Date(), 'yyyy-MM');
    const [reflection, setReflection] = useLocalStorage(`reflection_${currentMonth}`, {
        wins: '',
        challenges: '',
        lessons: '',
        forward: ''
    });

    const handleChange = (field, val) => {
        setReflection({ ...reflection, [field]: val });
    };

    // Fetch past entries when switching to Daily view
    useEffect(() => {
        if (viewMode === 'daily') {
            const entries = [];
            const today = new Date();

            // Look back 30 days
            for (let i = 1; i <= 30; i++) {
                const date = subDays(today, i);
                const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                const weekKey = format(weekStart, 'yyyy-MM-dd');

                // Calculate index (0 for Monday, 6 for Sunday)
                // differenceInCalendarDays returns simple diff, might need adjustment if weekStartsOn changes
                const dayIndex = (date.getDay() + 6) % 7;

                // 1. Get Text Data
                const weeklyDataRaw = localStorage.getItem(`weekly_${weekKey}`);
                let dayText = '';
                if (weeklyDataRaw) {
                    try {
                        const parsed = JSON.parse(weeklyDataRaw);
                        if (parsed.days && parsed.days[dayIndex]) {
                            dayText = parsed.days[dayIndex];
                        }
                    } catch (e) {
                        console.error("Error parsing weekly data", e);
                    }
                }

                // 2. Get Drawing Data
                // Key format matches Weekly.jsx: weekly_day_{index}_{weekKey}
                const doodleKey = `doodle_weekly_day_${dayIndex}_${weekKey}`;
                let doodleData = localStorage.getItem(doodleKey);

                // Handle case where image is saved in text field (CreativeInput behavior)
                if (dayText.startsWith('data:image')) {
                    if (!doodleData) {
                        doodleData = dayText;
                    }
                    dayText = ''; // Clear text so it doesn't print raw base64
                }

                if (dayText || doodleData) {
                    entries.push({
                        date: date,
                        text: dayText,
                        image: doodleData
                    });
                }
            }
            setPastEntries(entries);
        }
    }, [viewMode]);

    return (
        <div className="reflection-page fade-in">
            <header className="reflection-header">
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'monthly' ? 'active' : ''}`}
                        onClick={() => setViewMode('monthly')}
                    >
                        <Moon size={18} /> Monthly
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
                        onClick={() => setViewMode('daily')}
                    >
                        <Calendar size={18} /> Past Days
                    </button>
                </div>
                {viewMode === 'monthly' ? (
                    <>
                        <h1>Closing the Month</h1>
                        <p>Honouring the journey of {format(new Date(), 'MMMM')}.</p>
                    </>
                ) : (
                    <>
                        <h1>Moments Collected</h1>
                        <p>A look back at your daily pages.</p>
                    </>
                )}
            </header>

            {viewMode === 'monthly' ? (
                <div className="reflection-grid">
                    <motion.div className="ref-card" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                        <h3>Wins I'm Proud Of</h3>
                        <CreativeInput
                            placeholder="Small or big..."
                            value={reflection.wins}
                            onChange={(val) => handleChange('wins', val)}
                        />
                    </motion.div>

                    <motion.div className="ref-card" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <h3>Challenges I Survived</h3>
                        <CreativeInput
                            placeholder="What tested you?"
                            value={reflection.challenges}
                            onChange={(val) => handleChange('challenges', val)}
                        />
                    </motion.div>

                    <motion.div className="ref-card" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <h3>Lessons I Learned</h3>
                        <CreativeInput
                            placeholder="What did you discover?"
                            value={reflection.lessons}
                            onChange={(val) => handleChange('lessons', val)}
                        />
                    </motion.div>

                    <motion.div className="ref-card" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <h3>What I'm Carrying Forward</h3>
                        <CreativeInput
                            placeholder="Intention for next month..."
                            value={reflection.forward}
                            onChange={(val) => handleChange('forward', val)}
                        />
                    </motion.div>
                </div>
            ) : (
                <div className="daily-reflection-list">
                    {pastEntries.length === 0 ? (
                        <div className="empty-state">No daily entries found for the last 30 days.</div>
                    ) : (
                        pastEntries.map((entry, idx) => (
                            <motion.div
                                key={idx}
                                className="daily-entry-card"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <div className="entry-date">
                                    <span className="entry-day">{format(entry.date, 'EEEE')}</span>
                                    <span className="entry-full-date">{format(entry.date, 'MMMM do')}</span>
                                </div>
                                <div className="entry-content">
                                    {entry.text && <p className="entry-text">{entry.text}</p>}
                                    {entry.image && (
                                        <img src={entry.image} alt="Daily doodle" className="entry-image" />
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            <div className="closing-statement">
                <p>“I honour how I showed up.”</p>
            </div>
        </div>
    );
};

export default Reflection;
