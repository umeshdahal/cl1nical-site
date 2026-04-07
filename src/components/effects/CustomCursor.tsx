import { useState, useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';

export default function CustomCursor() {
  const { x, y } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorX = useRef(0);
  const cursorY = useRef(0);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    
    let rafId: number;
    
    const animate = () => {
      cursorX.current += (x - cursorX.current) * 0.15;
      cursorY.current += (y - cursorY.current) * 0.15;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX.current}px, ${cursorY.current}px)`;
      }
      
      rafId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(rafId);
  }, [x, y, isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={`cursor-crosshair ${isHovering ? 'is-hovering' : ''}`}
    />
  );
}
