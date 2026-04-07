import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Sequence1TitleMachine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      if (textRef.current) {
        textRef.current.style.fontSize = '40vw';
        textRef.current.style.letterSpacing = '-0.05em';
        textRef.current.style.opacity = '1';
        textRef.current.style.color = 'var(--bg-dark)';
      }
      if (bgRef.current) {
        bgRef.current.style.backgroundColor = 'var(--bg-cream)';
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1.5,
          pin: true,
        }
      });

      // Font size: 2vw -> 40vw
      tl.fromTo(textRef.current, 
        { fontSize: '2vw' },
        { fontSize: '40vw', duration: 1, ease: 'none' },
        0
      );

      // Letter spacing: 0.5em -> -0.05em
      tl.fromTo(textRef.current,
        { letterSpacing: '0.5em' },
        { letterSpacing: '-0.05em', duration: 1, ease: 'none' },
        0
      );

      // Opacity: 0.2 -> 1
      tl.fromTo(textRef.current,
        { opacity: 0.2 },
        { opacity: 1, duration: 1, ease: 'none' },
        0
      );

      // Color: white -> cream (matches bg at 50%) -> dark
      tl.fromTo(textRef.current,
        { color: '#ffffff' },
        { color: '#F5F0E8', duration: 0.5, ease: 'none' },
        0
      );
      tl.to(textRef.current,
        { color: '#0a0a0a', duration: 0.5, ease: 'none' },
        0.5
      );

      // Background: dark -> cream
      tl.fromTo(bgRef.current,
        { backgroundColor: '#0a0a0a' },
        { backgroundColor: '#F5F0E8', duration: 1, ease: 'none' },
        0
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef} 
      className="sequence relative"
      style={{ height: '100vh' }}
    >
      <div 
        ref={bgRef}
        className="absolute inset-0"
        style={{ backgroundColor: '#0a0a0a', zIndex: 0 }}
      />
      <div 
        className="flex items-center justify-center"
        style={{ height: '100vh', position: 'relative', zIndex: 1 }}
      >
        <h1
          ref={textRef}
          className="font-heading font-semibold"
          style={{
            fontSize: '2vw',
            letterSpacing: '0.5em',
            opacity: 0.2,
            color: '#ffffff',
            willChange: 'transform, opacity, color',
          }}
        >
          cl1nical
        </h1>
      </div>
    </section>
  );
}
