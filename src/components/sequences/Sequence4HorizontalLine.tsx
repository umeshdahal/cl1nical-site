import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const LABELS = [
  { text: 'TASKS', position: 0.2, href: '/tasks' },
  { text: 'BOOKMARKS', position: 0.4, href: '/bookmarks' },
  { text: 'PASSWORDS', position: 0.6, href: '/passwords' },
  { text: 'FOCUS', position: 0.8, href: '/' },
];

export default function Sequence4HorizontalLine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<HTMLAnchorElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      if (dotRef.current) {
        dotRef.current.style.left = '100%';
      }
      labelRefs.current.forEach(label => {
        if (label) label.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Dot travels along the line
      gsap.to(dotRef.current, {
        left: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

      // Labels appear and pulse when dot reaches them
      LABELS.forEach((label, i) => {
        const labelEl = labelRefs.current[i];
        
        // Clip-path reveal
        gsap.fromTo(labelEl,
          { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0 0 0)',
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${label.position * 100}% bottom`,
              end: `${label.position * 100 + 10}% bottom`,
              scrub: true,
            }
          }
        );

        // Pulse when dot reaches
        gsap.to(labelEl, {
          scale: 1.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${label.position * 100}% center`,
            end: `${label.position * 100 + 5}% center`,
            scrub: true,
          }
        });
      });

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
        className="relative flex items-center justify-center"
        style={{ height: '100vh' }}
      >
        {/* Horizontal line */}
        <div 
          className="absolute"
          style={{
            width: '80%',
            height: '1px',
            backgroundColor: '#0a0a0a',
          }}
        />
        
        {/* Traveling dot */}
        <div
          ref={dotRef}
          className="absolute"
          style={{
            left: '0%',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#0a0a0a',
            transform: 'translate(-50%, -50%)',
            willChange: 'left',
          }}
        />
        
        {/* Labels as clickable links */}
        {LABELS.map((label, i) => (
          <a
            key={label.text}
            ref={el => { labelRefs.current[i] = el!; }}
            href={label.href}
            className="font-mono"
            style={{
              position: 'absolute',
              left: `${label.position * 100}%`,
              bottom: 'calc(50% + 20px)',
              transform: 'translateX(-50%)',
              fontSize: '11px',
              color: '#0a0a0a',
              textDecoration: 'none',
              clipPath: 'inset(100% 0 0 0)',
              willChange: 'clip-path, opacity, transform',
              cursor: 'pointer',
            }}
          >
            {label.text}
          </a>
        ))}
      </div>
    </section>
  );
}
