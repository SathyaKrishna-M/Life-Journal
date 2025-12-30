import React from 'react';
import { motion } from 'framer-motion';
import CreativeInput from '../components/CreativeInput/CreativeInput';
import useLocalStorage from '../hooks/useLocalStorage';
import { format } from 'date-fns';
import '../styles/Reflection.css';

const Reflection = () => {
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

    return (
        <div className="reflection-page fade-in">
            <header className="reflection-header">
                <h1>Closing the Month</h1>
                <p>Honouring the journey of {format(new Date(), 'MMMM')}.</p>
            </header>

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

            <div className="closing-statement">
                <p>“I honour how I showed up this month.”</p>
            </div>
        </div>
    );
};

export default Reflection;
