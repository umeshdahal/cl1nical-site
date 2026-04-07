import { useEffect, useRef, useMemo, useState } from 'react';
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

const NODES: Node[] = [
  { id: 'home', label: 'HOME', position: [0, 0, 0], href: '/', color: '#F5F0E8', size: 0.3 },
  { id: 'tasks', label: 'TASKS', position: [-4, 2, 0], href: '/tasks', color: '#E8A020', size: 0.2 },
  { id: 'bookmarks', label: 'BOOKMARKS', position: [4, 2, 0], href: '/bookmarks', color: '#2D5BE3', size: 0.2 },
  { id: 'passwords', label: 'PASSWORDS', position: [0, -3, 2], href: '/passwords', color: '#22C55E', size: 0.2 },
  { id: 'about', label: 'ABOUT', position: [-3, -2, -2], href: '/', color: '#E8572A', size: 0.15 },
  { id: 'contact', label: 'CONTACT', position: [3, -2, -2], href: '/', color: '#A855F7', size: 0.15 },
];

const EDGES: Edge[] = [
  { from: 'home', to: 'tasks' },
  { from: 'home', to: 'bookmarks' },
  { from: 'home', to: 'passwords' },
  { from: 'home', to: 'about' },
  { from: 'home', to: 'contact' },
  { from: 'tasks', to: 'bookmarks' },
  { from: 'tasks', to: 'passwords' },
  { from: 'bookmarks', to: 'contact' },
];

export default function GraphNavPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const labelsRef = useRef<THREE.Sprite[]>([]);
  const animationRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodeMap = useMemo(() => {
    const map = new Map<string, Node>();
    NODES.forEach(n => map.set(n.id, n));
    return map;
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0a');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create edges
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: '#333333', 
      transparent: true, 
      opacity: 0.5 
    });

    EDGES.forEach(edge => {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) return;

      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...fromNode.position),
        new THREE.Vector3(...toNode.position),
      ]);
      const line = new THREE.Line(geometry, edgeMaterial);
      scene.add(line);
    });

    // Create nodes
    const nodeMeshes: THREE.Mesh[] = [];
    const labelSprites: THREE.Sprite[] = [];

    NODES.forEach(node => {
      // Node sphere
      const geometry = new THREE.SphereGeometry(node.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...node.position);
      mesh.userData = { id: node.id, href: node.href, baseColor: node.color };
      scene.add(mesh);
      nodeMeshes.push(mesh);

      // Label sprite
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;
      ctx.fillStyle = node.color;
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, 128, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(node.position[0], node.position[1] - node.size - 0.4, node.position[2]);
      sprite.scale.set(2, 0.5, 1);
      scene.add(sprite);
      labelSprites.push(sprite);
    });

    nodesRef.current = nodeMeshes;
    labelsRef.current = labelSprites;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight('#ffffff', 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Subtle node rotation
      nodeMeshes.forEach((mesh, i) => {
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.002;
      });

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
        const { href } = intersects[0].object.userData;
        window.location.href = href;
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
  }, [nodeMap]);

  // Hover effect
  useEffect(() => {
    nodesRef.current.forEach(mesh => {
      const isHovered = mesh.userData.id === hoveredNode;
      const targetScale = isHovered ? 1.5 : 1;
      const targetEmissive = isHovered ? 0.8 : 0.3;

      gsap.to(mesh.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.3,
        ease: 'power2.out',
      });

      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(mesh.material, {
          emissiveIntensity: targetEmissive,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  }, [hoveredNode]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#0a0a0a' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Overlay UI */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 24,
        fontFamily: "'DM Mono', monospace",
        color: '#F5F0E8',
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
        color: 'rgba(245, 240, 232, 0.5)',
        fontSize: '12px',
      }}>
        Click a node to navigate
      </div>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: "'Clash Display', sans-serif",
        fontSize: '24px',
        color: 'rgba(245, 240, 232, 0.1)',
        pointerEvents: 'none',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        NAVIGATE
      </div>
    </div>
  );
}
