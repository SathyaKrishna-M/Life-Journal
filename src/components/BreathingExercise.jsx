import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Simple breathing circle animation
const BreathingExercise = () => {
    const [text, setText] = useState("Breathe In");

    // Cycle text for guidance (approximate timing with animation)
    useEffect(() => {
        const interval = setInterval(() => {
            setText(prev => prev === "Breathe In" ? "Hold" : prev === "Hold" ? "Breathe Out" : "Breathe In");
        }, 4000); // This logic is simplistic, animation loop below handles the smooth visual
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--color-bg-cream)',
            borderRadius: 'var(--radius-lg)'
        }}>
            <motion.div
                animate={{
                    scale: [1, 1.5, 1.5, 1],
                    opacity: [0.6, 1, 1, 0.6],
                }}
                transition={{
                    duration: 12, // 4s in, 4s hold, 4s out
                    repeat: Infinity,
                    times: [0, 0.33, 0.66, 1],
                    ease: "easeInOut"
                }}
                style={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-pastel-sage)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 40px var(--color-pastel-sage)'
                }}
            >
                {/* 
                  Text inside or outside? Outside might be clearer if animation is key.
                  Let's just keep it simple visual.
               */}
            </motion.div>
            <p style={{ marginTop: '1.5rem', fontSize: '1.2rem', color: 'var(--color-earth-1)' }}>
                Follow the circle...
            </p>
        </div>
    );
};

export default BreathingExercise;
