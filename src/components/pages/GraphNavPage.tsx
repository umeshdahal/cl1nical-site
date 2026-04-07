import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface Node {
  id: string;
  label: string;
  position: [number, number, number];
  href: string;
  color: string;
  size: number;
}

interface Edge {
  from: string;
  to: string;
}

const COLORS = ['#E8A020', '#2D5BE3', '#22C55E', '#E8572A', '#A855F7', '#EC4899', '#06B6D4', '#F59E0B', '#EF4444', '#8B5CF6'];

const IMAGE_NODES = [
  { id: 'img1', label: 'MOUNTAINS', href: 'https://picsum.photos/seed/mountains/800/600' },
  { id: 'img2', label: 'OCEAN', href: 'https://picsum.photos/seed/ocean/800/600' },
  { id: 'img3', label: 'FOREST', href: 'https://picsum.photos/seed/forest/800/600' },
  { id: 'img4', label: 'DESERT', href: 'https://picsum.photos/seed/desert/800/600' },
  { id: 'img5', label: 'CITY', href: 'https://picsum.photos/seed/city/800/600' },
  { id: 'img6', label: 'SUNSET', href: 'https://picsum.photos/seed/sunset/800/600' },
  { id: 'img7', label: 'SNOW', href: 'https://picsum.photos/seed/snow/800/600' },
  { id: 'img8', label: 'FLOWERS', href: 'https://picsum.photos/seed/flowers/800/600' },
  { id: 'img9', label: 'STARS', href: 'https://picsum.photos/seed/stars/800/600' },
  { id: 'img10', label: 'RIVER', href: 'https://picsum.photos/seed/river/800/600' },
  { id: 'img11', label: 'CAVE', href: 'https://picsum.photos/seed/cave/800/600' },
  { id: 'img12', label: 'BRIDGE', href: 'https://picsum.photos/seed/bridge/800/600' },
];

const NAV_NODES = [
  { id: 'home', label: 'HOME', href: '/' },
  { id: 'tasks', label: 'TASKS', href: '/tasks' },
  { id: 'bookmarks', label: 'BOOKMARKS', href: '/bookmarks' },
  { id: 'passwords', label: 'PASSWORDS', href: '/passwords' },
  { id: 'graph', label: 'GRAPH', href: '/graph-nav' },
];

function generateNodes(id: string, label: string, href: string, index: number, total: number): Node {
  const phi = Math.acos(1 - 2 * (index + 0.5) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;
  const r = 6 + Math.random() * 8;
  return {
    id,
    label,
    position: [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ],
    href,
    color: COLORS[index % COLORS.length],
    size: 0.15 + Math.random() * 0.2,
  };
}

const ALL_NODES: Node[] = [
  ...NAV_NODES.map((n, i) => generateNodes(n.id, n.label, n.href, i, NAV_NODES.length + IMAGE_NODES.length)),
  ...IMAGE_NODES.map((n, i) => generateNodes(n.id, n.label, n.href, i + NAV_NODES.length, NAV_NODES.length + IMAGE_NODES.length)),
];

function generateEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];
  const maxDist = 8;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i].position;
      const b = nodes[j].position;
      const dist = Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
      if (dist < maxDist && Math.random() > 0.4) {
        edges.push({ from: nodes[i].id, to: nodes[j].id });
      }
    }
  }
  return edges;
}

const EDGES = generateEdges(ALL_NODES);

export default function GraphNavPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const timeRef = useRef(0);

  const nodeMap = useMemo(() => {
    const map = new Map<string, Node>();
    ALL_NODES.forEach(n => map.set(n.id, n));
    return map;
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    const node = nodeMap.get(nodeId);
    if (node) {
      window.open(node.href, '_blank');
    }
  }, [nodeMap]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.FogExp2('#050505', 0.02);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Background particles
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 100;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: '#333333', size: 0.1, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Edges with animated dashes
    const edgeMaterial = new THREE.LineDashedMaterial({ 
      color: '#444444', 
      transparent: true, 
      opacity: 0.3,
      dashSize: 0.3,
      gapSize: 0.2,
    });

    EDGES.forEach(edge => {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) return;

      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...fromNode.position),
        new THREE.Vector3(...toNode.position),
      ]);
      const line = new THREE.Line(geometry, edgeMaterial.clone());
      line.computeLineDistances();
      scene.add(line);
    });

    // Nodes
    const nodeMeshes: THREE.Mesh[] = [];

    ALL_NODES.forEach(node => {
      const geometry = new THREE.SphereGeometry(node.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...node.position);
      mesh.userData = { id: node.id, href: node.href, baseColor: node.color, originalPos: [...node.position] };
      scene.add(mesh);
      nodeMeshes.push(mesh);
    });

    nodesRef.current = nodeMeshes;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.3);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight('#E8A020', 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight('#2D5BE3', 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.01;
      const t = timeRef.current;
      
      // Animate nodes - floating motion
      nodeMeshes.forEach((mesh, i) => {
        const origPos = mesh.userData.originalPos as number[];
        mesh.position.x = origPos[0] + Math.sin(t * 0.5 + i) * 0.3;
        mesh.position.y = origPos[1] + Math.cos(t * 0.3 + i * 0.5) * 0.3;
        mesh.position.z = origPos[2] + Math.sin(t * 0.4 + i * 0.7) * 0.2;
        
        // Pulse emissive
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          const isHovered = mesh.userData.id === hoveredNode;
          const baseIntensity = isHovered ? 1.0 : 0.4;
          mesh.material.emissiveIntensity = baseIntensity + Math.sin(t * 2 + i) * 0.1;
        }
      });

      // Rotate particles slowly
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0003;
        particlesRef.current.rotation.x += 0.0001;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const nodeId = intersects[0].object.userData.id;
        setHoveredNode(nodeId);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        document.body.style.cursor = 'default';
      }
    };

    const handleClick = () => {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        handleNodeClick(intersects[0].object.userData.id);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [nodeMap, hoveredNode, handleNodeClick]);

  // Hover effect with GSAP
  useEffect(() => {
    nodesRef.current.forEach(mesh => {
      const isHovered = mesh.userData.id === hoveredNode;
      const targetScale = isHovered ? 2 : 1;

      gsap.to(mesh.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
    });
  }, [hoveredNode]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#050505', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Overlay UI */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 24,
        fontFamily: "'DM Mono', monospace",
        color: '#F5F0E8',
        zIndex: 10,
      }}>
        <a href="/" style={{
          color: '#F5F0E8',
          textDecoration: 'none',
          fontSize: '14px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          ← Back
        </a>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        fontFamily: "'DM Mono', monospace",
        color: 'rgba(245, 240, 232, 0.4)',
        fontSize: '11px',
        zIndex: 10,
      }}>
        {ALL_NODES.length} nodes · {EDGES.length} connections · click to explore
      </div>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: "'Clash Display', sans-serif",
        fontSize: '48px',
        color: 'rgba(245, 240, 232, 0.03)',
        pointerEvents: 'none',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        EXPLORE
      </div>
    </div>
  );
}
