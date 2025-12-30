import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Move } from 'lucide-react';
import '../styles/VisionBoard.css';

const VisionBoard = () => {
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('visionBoard_images');
        if (saved) {
            try {
                setImages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse vision board images", e);
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('visionBoard_images', JSON.stringify(images));
    }, [images]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = {
                    id: Date.now().toString(),
                    src: reader.result,
                    x: 50,
                    y: 50,
                    width: 200,
                    zIndex: images.length + 1
                };
                setImages([...images, newImage]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("imageId", id);
        // Calculate offset
        const img = images.find(i => i.id === id);
        if (img && e.target.getBoundingClientRect) {
            const rect = e.target.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            e.dataTransfer.setData("offsetX", offsetX);
            e.dataTransfer.setData("offsetY", offsetY);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("imageId");
        const offX = parseInt(e.dataTransfer.getData("offsetX") || 0);
        const offY = parseInt(e.dataTransfer.getData("offsetY") || 0);

        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - containerRect.left - offX;
            const y = e.clientY - containerRect.top - offY;

            setImages(images.map(img =>
                img.id === id ? { ...img, x, y } : img
            ));
        }
    };

    const removeImage = (id) => {
        setImages(images.filter(img => img.id !== id));
    };

    // Simple resize placeholder logic: randomized slight rotation for aesthetic chaos
    const getRotation = (id) => {
        const num = parseInt(id.slice(-3));
        return (num % 10) - 5; // -5 to 5 degrees
    }

    return (
        <div className="vision-page fade-in">
            <div className="vision-header">
                <h1>My Vision</h1>
                <p className="vision-caption">“What you see often, you slowly become.”</p>
                <button className="add-btn" onClick={() => fileInputRef.current.click()}>+ Add Image</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>

            <div className="vision-content-wrapper">
                <div
                    className="vision-canvas bg-dotted"
                    ref={containerRef}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="vision-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, img.id)}
                            style={{
                                left: img.x,
                                top: img.y,
                                width: img.width,
                                zIndex: img.zIndex,
                                transform: `rotate(${getRotation(img.id)}deg)`
                            }}
                        >
                            <div className="img-controls">
                                <Trash2 size={16} onClick={() => removeImage(img.id)} className="control-icon trash" />
                                <Move size={16} className="control-icon move" />
                            </div>
                            <img src={img.src} alt="vision" draggable={false} />
                        </div>
                    ))}

                    {images.length === 0 && (
                        <div className="empty-state">
                            <p>Drag & Drop or Click "+ Add Image" to start your board.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisionBoard;
