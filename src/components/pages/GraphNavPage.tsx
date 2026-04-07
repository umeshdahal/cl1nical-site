import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import * as THREE from 'three';

interface Node {
  id: string;
  label: string;
  position: [number, number, number];
  href: string;
}

const LABELS = [
  'INTERACTIVE ART', 'CLIENT WORKS', 'ABOUT', 'CONTACT', 'LAB',
  'MOVING IMAGE', 'ARCHIVE', 'TASKS', 'BOOKMARKS', 'PASSWORDS',
  'HOME', 'GRAPH', 'DESIGN', 'DEVELOP', 'CREATE',
  'EXPLORE', 'NAVIGATE', 'DISCOVER', 'BUILD', 'SHIP',
];

const HREFS: Record<string, string> = {
  'HOME': '/',
  'TASKS': '/tasks',
  'BOOKMARKS': '/bookmarks',
  'PASSWORDS': '/passwords',
  'GRAPH': '/graph-nav',
};

function generateNodes(count: number): Node[] {
  const nodes: Node[] = [];
  const r = 12;
  
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const label = LABELS[i % LABELS.length];
    const id = `node-${i}`;
    nodes.push({
      id,
      label,
      position: [
        r * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 4,
        r * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 4,
        r * Math.cos(phi) + (Math.random() - 0.5) * 4,
      ],
      href: HREFS[label] || '/',
    });
  }
  return nodes;
}

const NODES = generateNodes(60);

function generateEdges(nodes: Node[]): [number, number][] {
  const edges: [number, number][] = [];
  const maxDist = 14;
  const minDist = 2;
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i].position;
      const b = nodes[j].position;
      const dist = Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
      if (dist < maxDist && dist > minDist) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

const EDGES = generateEdges(NODES);

export default function GraphNavPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelsRef = useRef<THREE.Sprite[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  const animationRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const isDragging = useRef(false);
  const wasDragged = useRef(false);
  const mouseDownPos = useRef({ x: 0, y: 0 });
  const previousMouse = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const groupRef = useRef<THREE.Group | null>(null);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev.slice(-4), `[${time}] ${msg}`]);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 30;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Group to hold everything for rotation
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Create text sprites
    const labelSprites: THREE.Sprite[] = [];
    
    NODES.forEach((node, i) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 1024;
      canvas.height = 128;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, 512, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.5,
        depthWrite: false,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(...node.position);
      sprite.scale.set(6, 0.75, 1);
      sprite.userData = { id: node.id, label: node.label, href: node.href, index: i };
      group.add(sprite);
      labelSprites.push(sprite);
    });

    labelsRef.current = labelSprites;

    // Create lines
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: '#ffffff', 
      transparent: true, 
      opacity: 0.06,
      depthWrite: false,
    });

    const lines: THREE.Line[] = [];
    EDGES.forEach(([from, to]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...NODES[from].position),
        new THREE.Vector3(...NODES[to].position),
      ]);
      const line = new THREE.Line(geometry, lineMaterial.clone());
      group.add(line);
      lines.push(line);
    });
    linesRef.current = lines;

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Smooth rotation interpolation
      rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.05;
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.05;
      
      if (groupRef.current) {
        groupRef.current.rotation.x = rotation.current.x;
        groupRef.current.rotation.y = rotation.current.y;
      }

      // Subtle label pulse
      labelSprites.forEach((sprite, i) => {
        const isHovered = sprite.userData.label === hoveredLabel;
        const targetOpacity = isHovered ? 1 : 0.2 + Math.sin(Date.now() * 0.001 + i * 0.1) * 0.1;
        if (sprite.material instanceof THREE.SpriteMaterial) {
          sprite.material.opacity += (targetOpacity - sprite.material.opacity) * 0.1;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      wasDragged.current = false;
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging.current) {
        const dx = e.clientX - previousMouse.current.x;
        const dy = e.clientY - previousMouse.current.y;
        const totalDx = e.clientX - mouseDownPos.current.x;
        const totalDy = e.clientY - mouseDownPos.current.y;
        
        // Mark as dragged if moved more than 5 pixels
        if (Math.abs(totalDx) > 5 || Math.abs(totalDy) > 5) {
          wasDragged.current = true;
        }
        
        targetRotation.current.y += dx * 0.005;
        targetRotation.current.x += dy * 0.005;
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }

      // Raycasting for hover
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(labelSprites);

      if (intersects.length > 0) {
        const label = intersects[0].object.userData.label;
        setHoveredLabel(label);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredLabel(null);
        document.body.style.cursor = isDragging.current ? 'grabbing' : 'grab';
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'grab';
    };

    const handleClick = () => {
      // Don't navigate if we were dragging
      if (wasDragged.current) return;
      
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(labelSprites);
      if (intersects.length > 0) {
        const { label, href } = intersects[0].object.userData;
        addLog(`HOVER ${label}`);
        window.location.href = href;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (cameraRef.current) {
        cameraRef.current.position.z += e.deltaY * 0.01;
        cameraRef.current.position.z = Math.max(10, Math.min(60, cameraRef.current.position.z));
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);
    window.addEventListener('wheel', handleWheel);

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [hoveredLabel, addLog]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden', cursor: 'grab' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Top left - site name */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        fontFamily: 'monospace',
        color: '#ffffff',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        zIndex: 10,
      }}>
        CL1NICAL
      </div>

      {/* Bottom left - logs */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        fontFamily: 'monospace',
        color: '#ffffff',
        fontSize: '9px',
        lineHeight: '1.6',
        zIndex: 10,
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ opacity: 0.5 }}>{'>'} {log}</div>
        ))}
      </div>

      {/* Bottom center - hint */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'monospace',
        color: '#ffffff',
        fontSize: '9px',
        opacity: 0.3,
        letterSpacing: '0.1em',
        zIndex: 10,
      }}>
        scroll or drag to explore
      </div>
    </div>
  );
}
