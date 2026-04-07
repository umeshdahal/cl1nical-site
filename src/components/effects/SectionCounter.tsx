import { useEffect, useState } from 'react';

const TOTAL_SEQUENCES = 3;

export default function SectionCounter() {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      const sequence = Math.min(Math.floor(scrollPercent * TOTAL_SEQUENCES) + 1, TOTAL_SEQUENCES);
      setCurrent(sequence);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="section-counter">
      {String(current).padStart(2, '0')} / {String(TOTAL_SEQUENCES).padStart(2, '0')}
    </div>
  );
}
