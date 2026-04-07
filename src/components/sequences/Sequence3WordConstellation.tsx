import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 2000;
const WORDS = ['BEST', 'TEEMO', 'JUNGLER', 'IN', 'NA'];

function getWordPositions(word: string): THREE.Vector3[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 300;
  canvas.height = 100;
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 300, 100);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(word, 150, 50);
  
  const imageData = ctx.getImageData(0, 0, 300, 100);
  const positions: THREE.Vector3[] = [];
  
  for (let y = 0; y < 100; y += 2) {
    for (let x = 0; x < 300; x += 2) {
      const i = (y * 300 + x) * 4;
      if (imageData.data[i] > 128) {
        positions.push(new THREE.Vector3(
          (x - 150) * 0.025,
          -(y - 50) * 0.025,
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
  const prefersReducedMotion = useReducedMotion();

  const particleData = useMemo(() => {
    const gridPositions: THREE.Vector3[] = [];
    const wordPositions: THREE.Vector3[][] = [];
    
    // Grid positions (initial state)
    const gridSize = Math.ceil(Math.sqrt(PARTICLE_COUNT));
    const spacing = 0.04;
    const offset = (gridSize * spacing) / 2;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      gridPositions.push(new THREE.Vector3(
        col * spacing - offset,
        row * spacing - offset,
        0
      ));
    }
    
    // Word positions for each word
    WORDS.forEach(word => {
      const positions = getWordPositions(word);
      wordPositions.push(positions);
    });
    
    return { gridPositions, wordPositions };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F5F0E8');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = particleData.gridPositions[i].x;
      positions[i * 3 + 1] = particleData.gridPositions[i].y;
      positions[i * 3 + 2] = particleData.gridPositions[i].z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: '#0a0a0a',
      size: 0.03,
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
          end: '+=250%',
          scrub: 1.5,
          pin: true,
        }
      });

      const posAttr = geometry.getAttribute('position');
      const numWords = WORDS.length;
      const phaseDuration = 1 / (numWords + 1); // +1 for grid->first word
      
      // Helper to interpolate between two states
      function morphParticles(fromPositions: THREE.Vector3[], toPositions: THREE.Vector3[], progress: number) {
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

      // Phase 1: Grid -> "BEST"
      tl.to({}, {
        duration: phaseDuration,
        ease: 'none',
        onUpdate: function() {
          const progress = this.progress() * (numWords + 1);
          morphParticles(particleData.gridPositions, particleData.wordPositions[0], progress);
        }
      }, 0);

      // Phase 2-6: Word transitions
      for (let i = 0; i < numWords - 1; i++) {
        tl.to({}, {
          duration: phaseDuration,
          ease: 'none',
          onUpdate: function() {
            const progress = (this.progress() - phaseDuration * (i + 1)) * (numWords + 1);
            morphParticles(particleData.wordPositions[i], particleData.wordPositions[i + 1], progress);
          }
        }, phaseDuration * (i + 1));
      }

      // Background color transition: cream -> dark
      tl.to(scene.background, {
        r: 0.04, g: 0.04, b: 0.04, // #0a0a0a
        duration: 0.3,
        ease: 'none',
      }, 0.7);

      // Particle color: dark -> amber -> blue -> white
      const colorObj = { r: 0.04, g: 0.04, b: 0.04 };
      tl.to(colorObj, {
        r: 0.91, g: 0.63, b: 0.13, // #E8A020
        duration: 0.4,
        ease: 'none',
        onUpdate: () => material.color.setRGB(colorObj.r, colorObj.g, colorObj.b),
      }, 0.2);

      tl.to(colorObj, {
        r: 0.18, g: 0.36, b: 0.89, // #2D5BE3
        duration: 0.3,
        ease: 'none',
        onUpdate: () => material.color.setRGB(colorObj.r, colorObj.g, colorObj.b),
      }, 0.6);

      tl.to(colorObj, {
        r: 1, g: 1, b: 1, // #ffffff
        duration: 0.2,
        ease: 'none',
        onUpdate: () => material.color.setRGB(colorObj.r, colorObj.g, colorObj.b),
      }, 0.9);

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
      style={{ height: '250vh', backgroundColor: '#F5F0E8' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
      />
    </section>
  );
}
