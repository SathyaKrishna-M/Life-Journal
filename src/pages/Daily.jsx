import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, Cloud, Sun, Wind, CheckCircle } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import CreativeInput from '../components/CreativeInput/CreativeInput';
import DoodleCanvas from '../components/DoodleCanvas/DoodleCanvas';
import BreathingExercise from '../components/BreathingExercise';
import { SAD_QUOTES, JOYFUL_TASKS, MINDFULNESS_TASKS } from '../data/dailyPrompts';
import '../styles/Daily.css';

const DailyPlanner = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const [dailyData, setDailyData] = useLocalStorage(`daily_${todayStr}`, {
        topTasks: ['', '', ''],
        todos: [],
        mood: null,
        gratitude: '',
        reflection: '',
        habits: {}
    });

    // New ToDo Input
    const [newTodo, setNewTodo] = useState('');

    const handleTaskChange = (idx, val) => {
        const newTasks = [...dailyData.topTasks];
        newTasks[idx] = val;
        setDailyData({ ...dailyData, topTasks: newTasks });
    };

    const addTodo = (e) => {
        if (e.key === 'Enter' && newTodo.trim()) {
            setDailyData({
                ...dailyData,
                todos: [...dailyData.todos, { id: Date.now(), text: newTodo, done: false }]
            });
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setDailyData({
            ...dailyData,
            todos: dailyData.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
        });
    };

    const setMood = (mood) => {
        setDailyData({ ...dailyData, mood });
    };

    // Smart Action Content
    const renderSmartAction = () => {
        switch (dailyData.mood) {
            case 'anxious':
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="smart-action-box">
                        <h3>Calm Your Mind</h3>
                        <p className="action-hint">Let your worries flow out onto the canvas.</p>
                        <DoodleCanvas canvasId={`anxious_${todayStr}`} />
                    </motion.div>
                );
            case 'sad':
                // Pick random quote based on date hash or just random? Random is fine.
                const quote = SAD_QUOTES[Math.floor(Math.random() * SAD_QUOTES.length)];
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="smart-action-box quote-box">
                        <h3>A Gentle Reminder</h3>
                        <p>“{quote}”</p>
                    </motion.div>
                );
            case 'joyful':
                const task = JOYFUL_TASKS[Math.floor(Math.random() * JOYFUL_TASKS.length)];
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="smart-action-box joyful-box">
                        <h3>Creative Spark</h3>
                        <p>{task}</p>
                        <CreativeInput placeholder="Capture it here..." value="" onChange={() => { }} />
                    </motion.div>
                );
            case 'calm':
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="smart-action-box calm-box">
                        <h3>Stay Grounded</h3>
                        <BreathingExercise />
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="daily-page fade-in">
            <header className="daily-header">
                <h1>Today</h1>
                <p className="date-display">{format(new Date(), 'EEEE, MMMM do')}</p>
            </header>

            <div className="daily-grid">
                {/* Left Column: Planning */}
                <div className="planning-column">
                    <section className="section top-3">
                        <h2>Top 3 Priorities</h2>
                        {dailyData.topTasks.map((task, i) => (
                            <div key={i} className="task-row creative-row">
                                <span className="task-num">{i + 1}</span>
                                <CreativeInput
                                    value={task}
                                    onChange={(val) => handleTaskChange(i, val)}
                                    placeholder="Priority..."
                                    className="flex-grow"
                                />
                            </div>
                        ))}
                    </section>

                    <section className="section todo-list">
                        <h2>To-Do List</h2>
                        <input
                            className="new-todo"
                            type="text"
                            placeholder="+ Add a task"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyDown={addTodo}
                        />
                        <div className="todos-container">
                            {dailyData.todos.map(todo => (
                                <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`} onClick={() => toggleTodo(todo.id)}>
                                    <div className="checkbox">
                                        {todo.done && <CheckCircle size={14} color="white" />}
                                    </div>
                                    <span>{todo.text}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="section gratitude">
                        <h2>Gratitude</h2>
                        <p className="prompt-text">“One small thing I’m grateful for today…”</p>
                        <CreativeInput
                            value={dailyData.gratitude}
                            onChange={(val) => setDailyData({ ...dailyData, gratitude: val })}
                            placeholder="..."
                        />
                    </section>
                </div>

                {/* Right Column: Mood & Reflection */}
                <div className="mood-column">
                    <section className="section mood-section">
                        <h2>How are you feeling?</h2>
                        <div className="mood-selector">
                            <button className={`mood-btn ${dailyData.mood === 'anxious' ? 'active' : ''}`} onClick={() => setMood('anxious')}>
                                <Wind size={24} /> <span>Anxious</span>
                            </button>
                            <button className={`mood-btn ${dailyData.mood === 'sad' ? 'active' : ''}`} onClick={() => setMood('sad')}>
                                <Cloud size={24} /> <span>Sad</span>
                            </button>
                            <button className={`mood-btn ${dailyData.mood === 'joyful' ? 'active' : ''}`} onClick={() => setMood('joyful')}>
                                <Sun size={24} /> <span>Joyful</span>
                            </button>
                            <button className={`mood-btn ${dailyData.mood === 'calm' ? 'active' : ''}`} onClick={() => setMood('calm')}>
                                <Smile size={24} /> <span>Calm</span>
                            </button>
                        </div>
                    </section>

                    <AnimatePresence mode='wait'>
                        {dailyData.mood && (
                            <motion.div
                                key={dailyData.mood}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="smart-action-container"
                            >
                                {renderSmartAction()}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <section className="section reflection">
                        <h2>Daily Reflection</h2>
                        <p className="prompt-text">“What stayed with me today?”</p>
                        <CreativeInput
                            value={dailyData.reflection}
                            onChange={(val) => setDailyData({ ...dailyData, reflection: val })}
                            placeholder="Write freely..."
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DailyPlanner;
