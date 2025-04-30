'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

/**
 * A React functional component that renders a canvas with animated particles.
 * The particles bounce off the edges of the canvas and are connected by lines if they are close enough.
 * The particle colors and line opacities adjust based on the current theme (dark or light).
 *
 * @returns {JSX.Element} A React element containing the canvas.
 */
export const PanelParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match parent
    /**
     * Resizes the canvas element to match its parent's dimensions.
     *
     * This function retrieves the parent element of the canvas and sets the canvas's width and height
     * to be equal to the client width and height of the parent, respectively. If the canvas does not have a parent,
     * this function has no effect.
     */
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const particleCount = 50;
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
    
    // Animation loop
    /**
     * Animate function to update and render particles on the canvas.
     *
     * This function clears the canvas, updates the position of each particle,
     * handles edge collisions, draws the particles, and connects nearby particles with lines.
     * It then calls itself recursively using `requestAnimationFrame` for continuous animation.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particleColor = theme === 'dark' ? '255, 255, 255' : '0, 0, 0';
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY = -particle.speedY;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`;
        ctx.fill();
      });
      
      // Connect particles with lines if close enough
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${particleColor}, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full absolute top-0 left-0"
    />
  );
}; 