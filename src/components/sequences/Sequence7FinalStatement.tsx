import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Sequence7FinalStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lessRef = useRef<HTMLHeadingElement>(null);
  const isRef = useRef<HTMLHeadingElement>(null);
  const moreRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      if (lessRef.current) lessRef.current.style.opacity = '1';
      if (isRef.current) isRef.current.style.opacity = '1';
      if (moreRef.current) moreRef.current.style.opacity = '1';
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

      // Word 1: "LESS" slides from left (0-33%)
      tl.fromTo(lessRef.current,
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.33, ease: 'none' },
        0
      );

      // Word 2: "IS" slides from right (33-66%)
      tl.fromTo(isRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.33, ease: 'none' },
        0.33
      );

      // Word 3: "MORE" rises from bottom (66-100%)
      tl.fromTo(moreRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.34, ease: 'none' },
        0.66
      );

      // After all visible: pause, then "LESS" and "IS" fade out
      tl.to([lessRef.current, isRef.current], {
        opacity: 0,
        duration: 0.1,
        ease: 'none',
      }, 0.85);

      // "MORE" drifts to center
      tl.to(moreRef.current, {
        x: '0%',
        y: '0%',
        duration: 0.1,
        ease: 'none',
      }, 0.9);

      // CTA appears
      tl.fromTo(ctaRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.05, ease: 'none' },
        0.95
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef} 
      className="sequence relative"
      style={{ height: '100vh', backgroundColor: '#0a0a0a' }}
    >
      <div 
        className="relative flex items-center justify-center"
        style={{ height: '100vh' }}
      >
        {/* LESS — top left, 15vw */}
        <h1
          ref={lessRef}
          className="font-heading font-semibold absolute"
          style={{
            fontSize: '15vw',
            color: '#ffffff',
            top: '15%',
            left: '10%',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          LESS
        </h1>

        {/* IS — middle, 20vw */}
        <h1
          ref={isRef}
          className="font-heading font-semibold absolute"
          style={{
            fontSize: '20vw',
            color: '#ffffff',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          IS
        </h1>

        {/* MORE — bottom right, 30vw */}
        <h1
          ref={moreRef}
          className="font-heading font-semibold absolute"
          style={{
            fontSize: '30vw',
            color: '#ffffff',
            bottom: '10%',
            right: '10%',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          MORE
        </h1>

        {/* CTA Button */}
        <button
          ref={ctaRef}
          className="font-mono absolute"
          style={{
            padding: '16px 48px',
            fontSize: '14px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            backgroundColor: '#ffffff',
            color: '#0a0a0a',
            border: 'none',
            cursor: 'pointer',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
          onClick={() => alert('Welcome to cl1nical')}
        >
          ENTER
        </button>
      </div>
    </section>
  );
}
