import React from 'react';
import { motion } from 'framer-motion';
import DoodleCanvas from '../components/DoodleCanvas/DoodleCanvas';
import CreativeInput from '../components/CreativeInput/CreativeInput';
import useLocalStorage from '../hooks/useLocalStorage';
import '../styles/Goals.css';

const CATEGORIES = [
    { id: 'career', label: 'Career', placeholder: 'Build work that feels meaningful...' },
    { id: 'health', label: 'Health & Wellness', placeholder: 'Care for your body and mind gently...' },
    { id: 'love', label: 'Love & People', placeholder: 'Nurture connections that feel safe...' },
    { id: 'growth', label: 'Personal Growth', placeholder: 'Become softer, wiser, stronger...' },
    { id: 'money', label: 'Money', placeholder: 'Create abundance with awareness...' },
    { id: 'projects', label: 'Projects', placeholder: 'Let ideas take shape...' },
];

const Goals = () => {
    const [goals, setGoals] = useLocalStorage('goals', {});

    const handleGoalChange = (id, val) => {
        setGoals({ ...goals, [id]: val });
    };

    return (
        <div className="goals-page fade-in">
            <div className="header-section">
                <h1>Intentional Goals</h1>
                <p className="subtitle">Set intentions, not just targets.</p>
            </div>

            <div className="goals-scroll-area">
                <div className="goals-grid">
                    {CATEGORIES.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            className="goal-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <CreativeInput
                                id={`goal_${cat.id}`}
                                label={cat.label}
                                placeholder={cat.placeholder}
                                value={goals[cat.id] || ''}
                                onChange={(val) => handleGoalChange(cat.id, val)}
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="doodle-section">
                    <h2>Doodle Canvas</h2>
                    <p className="doodle-prompt">Free-draw, write, or sketch your dreams.</p>
                    <DoodleCanvas canvasId="goals_canvas" />
                </div>
            </div>
        </div>
    );
};

export default Goals;
