import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const GRID_SIZE = 8;
const TOTAL_SQUARES = GRID_SIZE * GRID_SIZE;

export default function Sequence6GridWipe() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<HTMLDivElement[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      squaresRef.current.forEach(square => {
        if (square) square.style.backgroundColor = '#0a0a0a';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

      // Wave pattern flip from top-left to bottom-right
      squaresRef.current.forEach((square, i) => {
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        const delay = (row + col) / (GRID_SIZE * 2 - 2);
        
        tl.to(square, {
          backgroundColor: '#0a0a0a',
          duration: 1 / TOTAL_SQUARES,
          ease: 'none',
        }, delay);
      });

      // Grid fades out after all squares flipped
      tl.to(gridRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: 'none',
      }, 0.9);

    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef} 
      className="sequence relative"
      style={{ height: '100vh', backgroundColor: '#F5F0E8' }}
    >
      <div 
        ref={gridRef}
        className="grid h-full w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '4px',
          padding: '4px',
          willChange: 'opacity',
        }}
      >
        {Array.from({ length: TOTAL_SQUARES }).map((_, i) => (
          <div
            key={i}
            ref={el => { squaresRef.current[i] = el!; }}
            style={{
              backgroundColor: '#F5F0E8',
              willChange: 'background-color',
            }}
          />
        ))}
      </div>
    </section>
  );
}
