import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Type, PenTool, Edit3 } from 'lucide-react';
import DoodleCanvas from '../DoodleCanvas/DoodleCanvas';
import './CreativeInput.css';

const CreativeInput = ({ value, onChange, placeholder, label, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('text'); // 'text' | 'draw'
    const [tempValue, setTempValue] = useState('');

    // Initialize temp value when opening
    useEffect(() => {
        if (isOpen) {
            // If value looks like data:image, we might default to draw mode, 
            // but for simplicity let's default to text and let user switch if they want to overwrite.
            // Actually, let's detect:
            if (value && value.startsWith('data:image')) {
                setMode('draw');
                // For drawing, we can't easily "edit" the existing PNG in the canvas without complex logic 
                // (loading image into canvas ctx). 
                // Our DoodleCanvas supports loading "saved" state if we pass an ID, but here we passing raw value.
                // For V1, we might just let them clear and redraw or switch to text. 
                // Let's rely on DoodleCanvas internal "defaultValue" prop if we add it, or just keep simple.
            } else {
                setMode('text');
                setTempValue(value || '');
            }
        }
    }, [isOpen, value]);

    const handleSave = () => {
        // If mode is text, save text.
        // If mode is draw, we need to extract from canvas.
        // Since DoodleCanvas saves to localStorage, we need to ask it for the data or pass a callback.
        // Let's update DoodleCanvas to support a "getRef" or "onChange" prop? 
        // Or simpler: We pass a specific ID for this modal session, and read from LS?
        // Better: Update DoodleCanvas to accept `ref` that exposes `getDataURL`.

        if (mode === 'text') {
            onChange(tempValue);
        } else {
            // This part is tricky with multiple modes. 
            // For now let's assume the DoodleCanvas saves to a specialized key or we modify DoodleCanvas.
            // Let's modify DoodleCanvas to accept an "onSave" trigger or ref.
            // See modification plan below. For now, assuming DoodleCanvas saves to LS key `temp_creative_${uniqueId}`
            const data = localStorage.getItem(`doodle_temp_creative`);
            if (data) onChange(data);
        }
        setIsOpen(false);
    };

    // Unique preview generation
    const renderPreview = () => {
        if (!value) return <span className="placeholder">{placeholder || "Click to write or draw..."}</span>;

        if (value.startsWith('data:image')) {
            return <img src={value} alt="Drawing" className="preview-image" />;
        }
        return <p className="preview-text">{value}</p>;
    };

    return (
        <>
            <div className={`creative-input-container ${className}`} onClick={() => setIsOpen(true)}>
                {label && <label className="input-label">{label}</label>}
                <div className="input-preview">
                    {renderPreview()}
                    <div className="edit-icon"><Edit3 size={14} /></div>
                </div>
            </div>

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
                                <button className="close-btn" onClick={() => setIsOpen(false)}>
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
                                        {/* reusing DoodleCanvas with a fixed temp ID */}
                                        <DoodleCanvas canvasId="temp_creative" />
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
                            onClick={() => setIsOpen(false)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CreativeInput;
