import React, { useEffect, useRef } from 'react';

const ParticlesBackground = ({ isDarkMode }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        setCanvasSize();

        let particles = [];
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000); // Responsive particle count

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 2 + 0.5,
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dotColor = isDarkMode ? 'rgba(56, 189, 248, 0.8)' : 'rgba(26, 86, 219, 0.6)';
            const lineColor = isDarkMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(26, 86, 219, 0.15)';

            ctx.fillStyle = dotColor;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connect particles that are close
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = lineColor;
                        // Opacity based on distance
                        ctx.globalAlpha = 1 - (dist / 120);
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1.0; // Reset alpha
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            setCanvasSize();
            // Re-initialize particles if window gets much bigger (simplified to just resize bounds)
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [isDarkMode]);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, background: 'var(--bg-color)' }} />;
};

export default ParticlesBackground;
