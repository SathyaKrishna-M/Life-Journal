import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Type, PenTool } from 'lucide-react';
import DoodleCanvas from '../DoodleCanvas/DoodleCanvas';
import './CreativeInput.css'; // Shared styles

const CreativeModal = ({ isOpen, onClose, onSave, initialValue, initialMode = 'text', canvasId }) => {
    const [mode, setMode] = useState(initialMode);
    const [tempValue, setTempValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialValue && initialValue.startsWith('data:image')) {
                setMode('draw');
            } else {
                setMode('text');
                setTempValue(initialValue || '');
            }
        }
    }, [isOpen, initialValue]);

    const handleSave = () => {
        if (mode === 'text') {
            onSave(tempValue, 'text');
        } else {
            const targetId = canvasId || 'temp_creative';
            const data = localStorage.getItem(`doodle_${targetId}`);
            if (data) onSave(data, 'draw');
        }
        onClose();
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="creative-modal"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <div className="modal-header">
                            <div className="mode-switch">
                                <button
                                    className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
                                    onClick={() => setMode('text')}
                                >
                                    <Type size={18} /> Write
                                </button>
                                <button
                                    className={`mode-btn ${mode === 'draw' ? 'active' : ''}`}
                                    onClick={() => setMode('draw')}
                                >
                                    <PenTool size={18} /> Draw
                                </button>
                            </div>
                            <button className="close-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-content">
                            {mode === 'text' ? (
                                <textarea
                                    className="modal-textarea"
                                    placeholder="Pour your thoughts here..."
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <div className="modal-canvas-wrapper">
                                    <DoodleCanvas
                                        canvasId={canvasId || "temp_creative"}
                                        initialData={initialValue && initialValue.startsWith('data:image') ? initialValue : null}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="save-btn" onClick={handleSave}>
                                <Check size={20} /> Save
                            </button>
                        </div>
                    </motion.div>
                    <motion.div
                        className="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CreativeModal;
