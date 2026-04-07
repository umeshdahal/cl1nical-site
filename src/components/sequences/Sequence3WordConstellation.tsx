import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 1500;
const WORDS = ['BEST', 'TEEMO', 'JUNGLER', 'IN', 'NA'];

function getWordPositions(word: string): THREE.Vector3[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 200;
  canvas.height = 80;
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 200, 80);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 56px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(word, 100, 40);
  
  const imageData = ctx.getImageData(0, 0, 200, 80);
  const positions: THREE.Vector3[] = [];
  
  for (let y = 0; y < 80; y += 2) {
    for (let x = 0; x < 200; x += 2) {
      const i = (y * 200 + x) * 4;
      if (imageData.data[i] > 128) {
        positions.push(new THREE.Vector3(
          (x - 100) * 0.035,
          -(y - 40) * 0.035,
          0
        ));
      }
    }
  }
  
  return positions;
}

export default function Sequence3WordConstellation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>(0);
  const currentWordRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const particleData = useMemo(() => {
    const spherePositions: THREE.Vector3[] = [];
    const wordPositions: THREE.Vector3[][] = [];
    
    // Sphere positions (initial state)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.2;
      spherePositions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }
    
    // Word positions for each word
    WORDS.forEach(word => {
      const positions = getWordPositions(word);
      wordPositions.push(positions);
    });
    
    return { spherePositions, wordPositions };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0a');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = particleData.spherePositions[i].x;
      positions[i * 3 + 1] = particleData.spherePositions[i].y;
      positions[i * 3 + 2] = particleData.spherePositions[i].z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: '#E8A020',
      size: 0.04,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1.5,
          pin: true,
        }
      });

      const posAttr = geometry.getAttribute('position');
      
      // Helper to interpolate between two word states
      function morphWord(fromPositions: THREE.Vector3[], toPositions: THREE.Vector3[], progress: number) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const from = fromPositions[i % fromPositions.length];
          const to = toPositions[i % toPositions.length];
          posAttr.setXYZ(i,
            from.x + (to.x - from.x) * progress,
            from.y + (to.y - from.y) * progress,
            from.z + (to.z - from.z) * progress
          );
        }
        posAttr.needsUpdate = true;
      }

      const numWords = WORDS.length;
      const phaseDuration = 1 / numWords;
      
      // Phase 1 (0-20%): Sphere -> "BEST"
      tl.to({}, {
        duration: phaseDuration,
        ease: 'none',
        onUpdate: function() {
          const progress = this.progress() * numWords;
          morphWord(particleData.spherePositions, particleData.wordPositions[0], progress);
        }
      }, 0);

      // Phase 2 (20-40%): "BEST" -> "TEEMO"
      tl.to({}, {
        duration: phaseDuration,
        ease: 'none',
        onUpdate: function() {
          const progress = (this.progress() - phaseDuration) * numWords;
          morphWord(particleData.wordPositions[0], particleData.wordPositions[1], progress);
        }
      }, phaseDuration);

      // Phase 3 (40-60%): "TEEMO" -> "JUNGLER"
      tl.to({}, {
        duration: phaseDuration,
        ease: 'none',
        onUpdate: function() {
          const progress = (this.progress() - phaseDuration * 2) * numWords;
          morphWord(particleData.wordPositions[1], particleData.wordPositions[2], progress);
        }
      }, phaseDuration * 2);

      // Phase 4 (60-80%): "JUNGLER" -> "IN"
      tl.to({}, {
        duration: phaseDuration,
        ease: 'none',
        onUpdate: function() {
          const progress = (this.progress() - phaseDuration * 3) * numWords;
          morphWord(particleData.wordPositions[2], particleData.wordPositions[3], progress);
        }
      }, phaseDuration * 3);

      // Phase 5 (80-100%): "IN" -> "NA"
      tl.to({}, {
        duration: phaseDuration,
        ease: 'none',
        onUpdate: function() {
          const progress = (this.progress() - phaseDuration * 4) * numWords;
          morphWord(particleData.wordPositions[3], particleData.wordPositions[4], progress);
        }
      }, phaseDuration * 4);

      // Color transitions
      const colorObj = { r: 0.91, g: 0.63, b: 0.13 };
      tl.to(colorObj, {
        r: 0.18, g: 0.36, b: 0.89,
        duration: 0.8,
        ease: 'none',
        onUpdate: () => {
          material.color.setRGB(colorObj.r, colorObj.g, colorObj.b);
        }
      }, 0);

      tl.to(colorObj, {
        r: 1, g: 1, b: 1,
        duration: 0.2,
        ease: 'none',
        onUpdate: () => {
          material.color.setRGB(colorObj.r, colorObj.g, colorObj.b);
        }
      }, 0.8);

      // Camera zoom in slightly for better readability
      tl.to(camera.position, {
        z: 4,
        duration: 1,
        ease: 'none',
      }, 0);

    }, sectionRef);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [prefersReducedMotion, particleData]);

  return (
    <section 
      ref={sectionRef} 
      className="sequence relative"
      style={{ height: '150vh', backgroundColor: '#0a0a0a' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
      />
    </section>
  );
}
