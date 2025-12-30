import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import CreativeModal from './CreativeModal';
import './CreativeInput.css';

const CreativeInput = ({ value, onChange, placeholder, label, className = '', id }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = (content, mode) => {
        onChange(content);
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

            <CreativeModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSave={handleSave}
                initialValue={value}
                canvasId={id || `creative_input_${Date.now()}`} // Fallback but id should be passed
            />
        </>
    );
};

export default CreativeInput;
