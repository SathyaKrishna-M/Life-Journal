import React, { useRef, useState, useEffect } from 'react';
import { RefreshCcw, Eraser, PenTool } from 'lucide-react';
import './DoodleCanvas.css';

const PRESET_COLORS = [
    '#4A4A4A', // Black/Dark
    '#8C7B70', // Earth Brown
    '#C6816D', // Clay
    '#9CAF88', // Sage
    '#D9D2CD', // Beige (Eraser-ish but visible)
    '#F2D7D5', // Pink
    '#E8DAEF', // Lavender
];

const DoodleCanvas = ({ canvasId }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#4A4A4A');
    const [brushSize, setBrushSize] = useState(3);
    const [mode, setMode] = useState('draw'); // draw | erase

    // Load canvas state
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Set initial size
        // In a real app we might want to resize observer, for now fixed/flexible logic
        canvas.width = canvas.offsetWidth;
        canvas.height = 400; // Fixed height

        // Restore
        const saved = localStorage.getItem(`doodle_${canvasId}`);
        if (saved) {
            const img = new Image();
            img.src = saved;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
        }

        // Background defaults
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [canvasId]);

    // Save on mouse up
    const endDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            localStorage.setItem(`doodle_${canvasId}`, canvas.toDataURL());
        }
    };

    const getCoordinates = (event) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;

        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.nativeEvent.offsetX;
            clientY = event.nativeEvent.offsetY;
            // Native offset is already relative, but we need consistent logic
            // For mouse, nativeEvent.offsetX is correct relative to node
            return { x: clientX, y: clientY };
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (event) => {
        // event.preventDefault(); // Prevent default touch actions (scrolling) - handled by touch-action: none but good practice
        if (event.type === 'touchstart') {
            // prevent scrolling
            // event.preventDefault(); 
            // Note: React synthetic events might need passive: false listener for preventDefault
            // style={{ touchAction: 'none' }} is better
        }

        const { x, y } = getCoordinates(event);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (event) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(event);
        const ctx = canvasRef.current.getContext('2d');

        if (mode === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = brushSize * 4;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.lineWidth = brushSize;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.removeItem(`doodle_${canvasId}`);
    };

    return (
        <div className="doodle-wrapper">
            <div className="doodle-toolbar">
                <div className="tools">
                    <button
                        className={`tool-btn ${mode === 'draw' ? 'active' : ''}`}
                        onClick={() => setMode('draw')}
                        title="Pen"
                    >
                        <PenTool size={18} />
                    </button>
                    <button
                        className={`tool-btn ${mode === 'erase' ? 'active' : ''}`}
                        onClick={() => setMode('erase')}
                        title="Eraser"
                    >
                        <Eraser size={18} />
                    </button>
                    <div className="divider-v" />

                    {PRESET_COLORS.map(c => (
                        <button
                            key={c}
                            className={`color-btn ${color === c ? 'active' : ''}`}
                            style={{ backgroundColor: c }}
                            onClick={() => { setColor(c); setMode('draw'); }}
                        />
                    ))}
                </div>
                <button className="tool-btn" onClick={clearCanvas} title="Clear">
                    <RefreshCcw size={16} />
                </button>
            </div>

            <canvas
                ref={canvasRef}
                className="doodle-canvas"
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseMove={draw}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={endDrawing}
                onTouchMove={draw}
                style={{ touchAction: 'none' }} // Prevent scrolling while drawing
            />
        </div>
    );
};

export default DoodleCanvas;
