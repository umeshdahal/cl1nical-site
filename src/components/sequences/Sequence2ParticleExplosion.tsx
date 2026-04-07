import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 2000;
const GRID_SIZE = Math.ceil(Math.sqrt(PARTICLE_COUNT));
const WORD = 'BEST';

function getFocusPositions(): THREE.Vector3[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 100;
  canvas.height = 40;
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 100, 40);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(WORD, 50, 20);
  
  const imageData = ctx.getImageData(0, 0, 100, 40);
  const positions: THREE.Vector3[] = [];
  
  for (let y = 0; y < 40; y += 2) {
    for (let x = 0; x < 100; x += 2) {
      const i = (y * 100 + x) * 4;
      if (imageData.data[i] > 128) {
        positions.push(new THREE.Vector3(
          (x - 50) * 0.08,
          -(y - 20) * 0.08,
          0
        ));
      }
    }
  }
  
  return positions;
}

export default function Sequence2ParticleExplosion() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const particleData = useMemo(() => {
    const gridPositions: THREE.Vector3[] = [];
    const randomPositions: THREE.Vector3[] = [];
    const focusPositions = getFocusPositions();
    
    const spacing = 0.04;
    const offset = (GRID_SIZE * spacing) / 2;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      
      gridPositions.push(new THREE.Vector3(
        col * spacing - offset,
        row * spacing - offset,
        0
      ));
      
      randomPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      ));
    }
    
    return { gridPositions, randomPositions, focusPositions };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F5F0E8');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
      size: 0.02,
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
      
      // Phase 1 (0-33%): Grid -> Random explosion
      tl.to({}, {
        duration: 0.33,
        ease: 'none',
        onUpdate: function() {
          const progress = this.progress();
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const grid = particleData.gridPositions[i];
            const random = particleData.randomPositions[i];
            posAttr.setXYZ(i,
              grid.x + (random.x - grid.x) * progress,
              grid.y + (random.y - grid.y) * progress,
              grid.z + (random.z - grid.z) * progress
            );
          }
          posAttr.needsUpdate = true;
        }
      }, 0);

      // Phase 2 (33-66%): Random -> FOCUS formation
      tl.to({}, {
        duration: 0.33,
        ease: 'none',
        onUpdate: function() {
          const progress = this.progress();
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const random = particleData.randomPositions[i];
            const focus = particleData.focusPositions[i % particleData.focusPositions.length];
            posAttr.setXYZ(i,
              random.x + (focus.x - random.x) * progress,
              random.y + (focus.y - random.y) * progress,
              random.z + (focus.z - random.z) * progress
            );
          }
          posAttr.needsUpdate = true;
        }
      }, 0.33);

      // Phase 3 (66-100%): FOCUS -> Implode to center
      tl.to({}, {
        duration: 0.34,
        ease: 'none',
        onUpdate: function() {
          const progress = this.progress();
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const focus = particleData.focusPositions[i % particleData.focusPositions.length];
            posAttr.setXYZ(i,
              focus.x + (0 - focus.x) * progress,
              focus.y + (0 - focus.y) * progress,
              focus.z + (0 - focus.z) * progress
            );
          }
          posAttr.needsUpdate = true;
        }
      }, 0.66);

      tl.to(camera.position, {
        z: 1,
        duration: 0.34,
        ease: 'none',
      }, 0.66);

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
      style={{ height: '150vh', backgroundColor: '#F5F0E8' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
      />
    </section>
  );
}
