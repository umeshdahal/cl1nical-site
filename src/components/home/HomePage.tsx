import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, MeshDistortMaterial, Points, PointMaterial, Sparkles } from '@react-three/drei';
import { ArrowRight, ShieldCheck, Orbit, Radar, Workflow, Lock, Vote } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';

const metrics = [
  { value: '03', label: 'Live systems', detail: 'Auth, election intelligence, and personal utility surfaces under one shell.' },
  { value: 'SSR', label: 'Session model', detail: 'Server-validated Supabase auth with protected routes and zero client-side token persistence.' },
  { value: '24/7', label: 'Responsive motion', detail: 'Scroll-linked transitions, layered depth, and reduced-motion fallbacks tuned for production.' },
];

const stories = [
  {
    eyebrow: 'System Layer',
    title: 'Secure infrastructure that feels fluid, not bureaucratic.',
    copy: 'The new shell uses SSR auth, redirect-safe email confirmation, and profile persistence that survives navigation, hard refreshes, and device changes.',
  },
  {
    eyebrow: 'Signal Layer',
    title: 'Election surfaces built from real geographic shapes and state-level data.',
    copy: 'The map now renders proper SVG state paths with responsive hover, click detail, and race-linked coloring instead of generic placeholders.',
  },
  {
    eyebrow: 'Experience Layer',
    title: 'A landing flow engineered like a launch moment, not a static brochure.',
    copy: 'Hero motion, pinned narratives, magnetic CTAs, and kinetic reveals work together as one designed system instead of disconnected effects.',
  },
];

const capabilities = [
  {
    icon: Orbit,
    title: 'Immersive Interface',
    body: 'A live 3D hero, layered atmospherics, and motion-reactive composition create immediate depth without sacrificing clarity.',
  },
  {
    icon: ShieldCheck,
    title: 'SSR Authentication',
    body: 'Supabase cookies, verified server sessions, and protected routes keep the account layer production-safe and Vercel-ready.',
  },
  {
    icon: Vote,
    title: 'Election Intelligence',
    body: 'State-level overlays, tooltips, and race drill-downs are built on accurate map geometry and composable dataset helpers.',
  },
  {
    icon: Workflow,
    title: 'Composable Surfaces',
    body: 'Tasks, bookmarks, profile preferences, and dashboards are positioned as modules inside a single coherent product language.',
  },
  {
    icon: Radar,
    title: 'Scroll Choreography',
    body: 'Sections reveal through timeline sequencing, parallax motion, pinned story beats, and directional transitions instead of generic fade-ins.',
  },
  {
    icon: Lock,
    title: 'Deployment-Ready',
    body: 'The frontend is structured for Vercel-era hosting with modern Astro, stable build output, and clean separation of client-heavy modules.',
  },
];

const commandDeck = [
  { label: 'Protected routes', value: '/dashboard /profile /elections' },
  { label: 'Auth redirect', value: 'https://cl1nical.dev/auth/confirm' },
  { label: 'Primary runtime', value: 'Astro SSR on Vercel' },
  { label: 'Visual stack', value: 'React, Three.js, GSAP, Lenis' },
];

function HeroConstellation({ reducedMotion }: { reducedMotion: boolean }) {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pointPositions = useRef<Float32Array>(new Float32Array(1200));

  if (pointPositions.current[0] === 0) {
    for (let i = 0; i < pointPositions.current.length; i += 3) {
      const radius = 1.6 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pointPositions.current[i] = radius * Math.sin(phi) * Math.cos(theta);
      pointPositions.current[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pointPositions.current[i + 2] = radius * Math.cos(phi);
    }
  }

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.rotation.y = t * (reducedMotion ? 0.05 : 0.18);
      orbRef.current.rotation.x = Math.sin(t * 0.3) * 0.18;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (reducedMotion ? 0.06 : 0.22);
      ringRef.current.rotation.x = Math.sin(t * 0.24) * 0.25;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * (reducedMotion ? 0.04 : 0.12);
      pointsRef.current.rotation.x = Math.cos(t * 0.15) * 0.12;
    }
  });

  return (
    <>
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 10, 28]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 3]} intensity={1.4} color="#78a6ff" />
      <directionalLight position={[-4, -1, -5]} intensity={0.8} color="#ffb457" />

      <Float speed={reducedMotion ? 0.5 : 1.2} rotationIntensity={reducedMotion ? 0.15 : 0.5} floatIntensity={reducedMotion ? 0.25 : 0.9}>
        <mesh ref={orbRef}>
          <icosahedronGeometry args={[1.8, 30]} />
          <MeshDistortMaterial
            color="#87a8ff"
            emissive="#1d4fff"
            emissiveIntensity={1.15}
            roughness={0.08}
            metalness={0.72}
            distort={reducedMotion ? 0.08 : 0.28}
            speed={reducedMotion ? 0.5 : 2}
          />
        </mesh>
      </Float>

      <group ref={ringRef}>
        <Line
          points={Array.from({ length: 121 }, (_, index) => {
            const angle = (index / 120) * Math.PI * 2;
            return [Math.cos(angle) * 3.1, Math.sin(angle) * 1.2, Math.sin(angle * 2) * 0.2] as [number, number, number];
          })}
          color="#ffb457"
          lineWidth={1}
          transparent
          opacity={0.7}
        />
        <Line
          points={Array.from({ length: 121 }, (_, index) => {
            const angle = (index / 120) * Math.PI * 2;
            return [Math.cos(angle) * 2.2, Math.sin(angle) * 2.8, Math.cos(angle * 3) * 0.16] as [number, number, number];
          })}
          color="#7be7ff"
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      </group>

      <Points ref={pointsRef} positions={pointPositions.current} stride={3} frustumCulled>
        <PointMaterial transparent color="#f5f7ff" size={0.055} sizeAttenuation depthWrite={false} />
      </Points>

      <Sparkles count={40} scale={[8, 8, 8]} size={1.8} speed={0.25} color="#b8d0ff" />
    </>
  );
}

function MagneticButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(element, {
        x: x * 0.12,
        y: y * 0.12,
        duration: 0.35,
        ease: 'power3.out',
      });
    };

    const reset = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: 'elastic.out(1, 0.35)',
      });
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', reset);

    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', reset);
    };
  }, []);

  const classes = variant === 'primary'
    ? 'bg-[linear-gradient(135deg,#f0b45f_0%,#ffd89b_100%)] text-slate-950 shadow-[0_18px_60px_rgba(240,180,95,0.35)]'
    : 'border border-white/12 bg-white/6 text-white';

  return (
    <a
      ref={ref}
      href={href}
      data-cursor="pulse"
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-[0.18em] uppercase transition-transform ${classes}`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    let cleanup: (() => void) | undefined;

    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([lenisModule, gsapModule, scrollTriggerModule]) => {
        const Lenis = lenisModule.default;
        const gsap = gsapModule.default;
        const ScrollTrigger = (scrollTriggerModule.default as { ScrollTrigger?: unknown }).ScrollTrigger ?? scrollTriggerModule.default;
        gsap.registerPlugin(ScrollTrigger as never);

        const lenis = new Lenis({
          duration: 1.15,
          smoothWheel: true,
          touchMultiplier: 1.15,
        });

        let rafId = 0;
        const raf = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);
        lenis.on('scroll', () => (ScrollTrigger as { update: () => void }).update());

        const context = gsap.context(() => {
          gsap.fromTo(
            '.hero-line',
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.08,
              ease: 'power4.out',
            },
          );

          gsap.fromTo(
            '.hero-meta, .hero-actions, .command-deck',
            { y: 36, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.1,
              delay: 0.3,
              ease: 'power3.out',
            },
          );

          gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
            gsap.fromTo(
              element,
              { y: 60, opacity: 0, filter: 'blur(12px)' },
              {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: element,
                  start: 'top 82%',
                },
              },
            );
          });

          const cards = gsap.utils.toArray<HTMLElement>('.story-card');
          if (cards.length > 0 && window.innerWidth >= 960) {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: '.story-stack',
                start: 'top top',
                end: '+=220%',
                scrub: true,
                pin: true,
              },
            });

            cards.forEach((card, index) => {
              timeline.to(card, {
                y: -index * 22,
                opacity: 1,
                scale: 1,
                duration: 0.8,
              }, index === 0 ? 0 : `>-=0.2`);
            });
          }

          gsap.to('.orb-shell', {
            yPercent: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-shell',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }, rootRef);

        cleanup = () => {
          context.revert();
          lenis.destroy();
          cancelAnimationFrame(rafId);
          (ScrollTrigger as { getAll: () => Array<{ kill: () => void }> }).getAll().forEach((trigger) => trigger.kill());
        };
      },
    );

    return () => cleanup?.();
  }, [reducedMotion]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia('(hover: none)').matches) {
      return;
    }

    const move = (event: MouseEvent) => {
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    };

    const enter = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const mode = target?.closest('[data-cursor]')?.getAttribute('data-cursor');
      cursor.dataset.mode = mode ?? 'default';
    };

    const leave = () => {
      cursor.dataset.mode = 'default';
    };

    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', enter);
    document.addEventListener('pointerout', leave);

    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', enter);
      document.removeEventListener('pointerout', leave);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(71,108,255,0.22),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(255,180,95,0.12),_transparent_22%),linear-gradient(180deg,#050816_0%,#08101f_38%,#060814_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />

      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white/10 mix-blend-screen transition-[width,height,background-color,border-color] duration-200 md:block data-[mode=pulse]:h-14 data-[mode=pulse]:w-14 data-[mode=pulse]:border-[#ffcf8e] data-[mode=pulse]:bg-[#ffcf8e]/15 data-[mode=panel]:h-10 data-[mode=panel]:w-10"
        data-mode="default"
      />

      <header className="fixed left-0 right-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="font-heading text-xl tracking-tight text-white" data-cursor="pulse">cl1nical</a>
          <div className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-white/60 md:flex">
            <a href="#systems" data-cursor="panel" className="transition hover:text-white">Systems</a>
            <a href="#story" data-cursor="panel" className="transition hover:text-white">Story</a>
            <a href="#modules" data-cursor="panel" className="transition hover:text-white">Modules</a>
            <a href="/elections" data-cursor="panel" className="transition hover:text-white">Elections</a>
            <a href="/dashboard" data-cursor="pulse" className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-white">Dashboard</a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="hero-shell relative min-h-screen overflow-hidden px-5 pb-14 pt-28 sm:px-8 lg:px-10">
          <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10">
              <div className="hero-meta inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/65 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
                Vercel-era rebuild
              </div>

              <div className="mt-8 space-y-2">
                {['Interactive systems', 'for civic signal,', 'secure identity,', 'and personal control.'].map((line) => (
                  <div key={line} className="overflow-hidden">
                    <h1 className="hero-line font-heading text-[clamp(3.4rem,9vw,7.6rem)] leading-[0.9] tracking-[-0.05em] text-white">
                      {line}
                    </h1>
                  </div>
                ))}
              </div>

              <p className="hero-meta mt-8 max-w-2xl text-base leading-7 text-white/66 sm:text-lg">
                cl1nical is now engineered as a premium interactive product surface: server-authenticated, visually cinematic,
                and structured to move seamlessly between identity, intelligence, and utility.
              </p>

              <div className="hero-actions mt-10 flex flex-col gap-4 sm:flex-row">
                <MagneticButton href="/dashboard">Enter dashboard</MagneticButton>
                <MagneticButton href="/elections" variant="secondary">Explore elections</MagneticButton>
              </div>

              <div className="command-deck mt-12 grid gap-3 sm:grid-cols-2">
                {commandDeck.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4 backdrop-blur" data-cursor="panel">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-white/88">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="orb-shell relative">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(88,120,255,0.32),_transparent_42%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_35px_140px_rgba(3,7,18,0.65)] backdrop-blur">
                <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/45">
                  <span>Realtime visual layer</span>
                  <span>Three.js + R3F</span>
                </div>
                <div className="h-[420px] sm:h-[520px] lg:h-[640px]">
                  {mounted ? (
                    <Canvas camera={{ position: [0, 0, 7.5], fov: 42 }} dpr={[1, 1.8]}>
                      <HeroConstellation reducedMotion={reducedMotion} />
                    </Canvas>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(88,120,255,0.28),_transparent_35%)]">
                      <div className="h-56 w-56 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(135,168,255,0.45),_rgba(29,79,255,0.18)_45%,_transparent_70%)] blur-[1px]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="systems" className="px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div data-reveal>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#9ab4ff]">System overview</p>
                <h2 className="mt-4 max-w-lg font-heading text-4xl leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                  Built like an operating surface, not a brochure.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {metrics.map((metric) => (
                  <article key={metric.label} data-reveal data-cursor="panel" className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur">
                    <p className="font-heading text-5xl tracking-[-0.05em] text-white">{metric.value}</p>
                    <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/40">{metric.label}</p>
                    <p className="mt-4 text-sm leading-6 text-white/64">{metric.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="story-stack px-5 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="lg:pt-16" data-reveal>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#ffcb88]">Scroll story</p>
              <h2 className="mt-4 font-heading text-4xl tracking-[-0.04em] text-white sm:text-5xl">
                Every layer introduces a different kind of confidence.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/64">
                Infrastructure, data, and interface are presented as a sequence of deliberate reveals so the page tells the product story as you move through it.
              </p>
            </div>

            <div className="relative min-h-[620px]">
              {stories.map((story, index) => (
                <article
                  key={story.title}
                  className="story-card absolute inset-x-0 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 opacity-100 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur"
                  style={{
                    top: `${index * 92}px`,
                    transform: `scale(${1 - index * 0.05})`,
                  }}
                  data-cursor="panel"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">{story.eyebrow}</p>
                  <h3 className="mt-5 max-w-xl font-heading text-3xl tracking-[-0.04em] text-white sm:text-4xl">
                    {story.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-white/64">{story.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div data-reveal>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#9ab4ff]">Modules</p>
                <h2 className="mt-4 font-heading text-4xl tracking-[-0.04em] text-white sm:text-5xl">
                  A sharper product stack across every route.
                </h2>
              </div>
              <a href="/profile" className="text-sm uppercase tracking-[0.22em] text-white/60 transition hover:text-white" data-cursor="panel">
                Profile and settings
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  data-reveal
                  data-cursor="panel"
                  className="group rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-[#ffcb88]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-heading text-2xl tracking-[-0.03em] text-white">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/62">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.28)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div data-reveal>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#ffcb88]">Launch sequence</p>
              <h2 className="mt-4 max-w-2xl font-heading text-4xl tracking-[-0.04em] text-white sm:text-5xl">
                Move from cinematic first impression to authenticated control in one flow.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/64">
                The landing page now acts as a premium entry point, while dashboard, elections, and profile surfaces carry the same visual rigor into the logged-in product.
              </p>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-2">
              <MagneticButton href="/register">Create account</MagneticButton>
              <MagneticButton href="/dashboard" variant="secondary">Open workspace</MagneticButton>
              <a href="/graph-nav" className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5 text-sm leading-6 text-white/66 sm:col-span-2" data-cursor="panel">
                The original graph navigator remains available as an exploratory route, but the primary brand entry now leads with narrative, hierarchy, and motion design.
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
