import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/Ownership.css';

const Ownership = () => {
    const [name, setName] = useState('');

    useEffect(() => {
        const savedName = localStorage.getItem('plannerName');
        if (savedName) setName(savedName);
    }, []);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        localStorage.setItem('plannerName', newName); // Simple local storage persistence
    };

    return (
        <div className="ownership-page fade-in">
            <div className="ownership-container">

                {/* Minimal Decorative Element */}
                <div className="deco-leaf">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 0C50 0 20 20 20 50C20 80 50 100 50 100C50 100 80 80 80 50C80 20 50 0 50 0Z" stroke="var(--color-sage)" strokeWidth="1.5" strokeDasharray="4 4" />
                        <path d="M50 0V100" stroke="var(--color-sage)" strokeWidth="1" />
                    </svg>
                </div>

                <motion.h1
                    className="title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    This Planner Belongs To
                </motion.h1>

                <motion.div
                    className="name-input-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <input
                        type="text"
                        placeholder="Your Name..."
                        value={name}
                        onChange={handleNameChange}
                        className="name-input"
                    />
                </motion.div>

                <motion.div
                    className="subtext-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <p className="purpose-text">“A space created for clarity, calm, and becoming.”</p>
                    <div className="divider"></div>
                    <p className="quote">“Slow days still move you forward.”</p>
                </motion.div>

            </div>
        </div>
    );
};

export default Ownership;
