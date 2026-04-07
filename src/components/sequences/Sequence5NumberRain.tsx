import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const NUMBERS = ['10,847', '0', '∞', '256', '99.9', '0ms'];
const COUNT = 60;

export default function Sequence5NumberRain() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<HTMLSpanElement[]>([]);
  const finalZeroRef = useRef<HTMLSpanElement>(null);
  const dollarSignRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const numberData = useMemo(() => {
    return Array.from({ length: COUNT }).map((_, i) => ({
      value: NUMBERS[i % NUMBERS.length],
      left: Math.random() * 100,
      size: 10 + Math.random() * 70,
      opacity: 0.1 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.5,
    }));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (finalZeroRef.current) {
        finalZeroRef.current.style.opacity = '1';
        finalZeroRef.current.style.fontSize = '80vw';
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

      // Numbers fall from top to bottom at different speeds
      numberRefs.current.forEach((num, i) => {
        const data = numberData[i];
        if (!num) return;
        
        gsap.set(num, {
          left: `${data.left}%`,
          fontSize: `${data.size}px`,
          opacity: data.opacity,
          top: '-10vh',
        });

        tl.to(num, {
          top: '110vh',
          duration: data.speed / 3,
          ease: 'none',
        }, 0);
      });

      // At 100%: screen clears, one "0" remains centered at 80vw
      tl.to(numberRefs.current, {
        opacity: 0,
        duration: 0.1,
        ease: 'none',
      }, 0.85);

      // Final zero appears
      tl.fromTo(finalZeroRef.current,
        { opacity: 0, fontSize: '20vw' },
        { opacity: 1, fontSize: '80vw', duration: 0.15, ease: 'none' },
        0.9
      );

      // Final zero shrinks
      tl.to(finalZeroRef.current, {
        fontSize: '10vw',
        duration: 0.05,
        ease: 'none',
      }, 0.95);

      // Dollar sign slides in
      tl.fromTo(dollarSignRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.05, ease: 'none' },
        0.97
      );

      // "$0" fades out
      tl.to([finalZeroRef.current, dollarSignRef.current], {
        opacity: 0,
        duration: 0.03,
        ease: 'none',
      }, 1);

    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, numberData]);

  return (
    <section 
      ref={sectionRef} 
      className="sequence relative"
      style={{ height: '100vh', backgroundColor: '#0a0a0a' }}
    >
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Falling numbers */}
        {numberData.map((data, i) => (
          <span
            key={i}
            ref={el => { numberRefs.current[i] = el!; }}
            className="font-mono font-semibold absolute"
            style={{
              color: '#ffffff',
              willChange: 'top, opacity',
            }}
          >
            {data.value}
          </span>
        ))}
        
        {/* Final "$0" */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ willChange: 'opacity' }}
        >
          <span
            ref={dollarSignRef}
            className="font-heading font-semibold"
            style={{
              fontSize: '10vw',
              color: '#ffffff',
              opacity: 0,
            }}
          >
            $
          </span>
          <span
            ref={finalZeroRef}
            className="font-heading font-semibold"
            style={{
              fontSize: '80vw',
              color: '#ffffff',
              opacity: 0,
            }}
          >
            0
          </span>
        </div>
      </div>
    </section>
  );
}
