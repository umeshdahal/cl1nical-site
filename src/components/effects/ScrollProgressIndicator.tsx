import { useScrollProgress } from '../../hooks/useScrollProgress';

export default function ScrollProgressIndicator() {
  const progress = useScrollProgress();
  
  return (
    <div 
      className="scroll-progress-line"
      style={{ height: `${progress * 100}%` }}
    />
  );
}
