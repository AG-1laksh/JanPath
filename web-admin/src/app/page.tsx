"use client";

import { useEffect, useMemo, useRef } from "react";
import type * as THREE from "three";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { Sparkles } from "@react-three/drei";
import Lenis from "lenis";
import Link from "next/link";
import {
  Star,
  Activity,
  Zap,
  ShieldCheck,
  Globe,
  Users,
  ArrowRight,
  Wrench,
  Cpu,
  Radar,
  Database
} from "lucide-react";
import styles from "./landing.module.css";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 26, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 90, damping: 20 }
  }
};

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const count = 200;
  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 10;
      arr[i3 + 1] = (Math.random() - 0.5) * 6;
      arr[i3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => basePositions.slice(), [basePositions]);

  useFrame(({ clock }) => {
    const mesh = points.current;
    if (!mesh) return;
    const arr = mesh.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];
      const dx = bx - pointer.x * 2.6;
      const dy = by - pointer.y * 1.6;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repel = Math.max(0, 1.6 - dist) * 0.1;
      arr[i3] = bx + dx * repel + Math.sin(t + bx) * 0.012;
      arr[i3 + 1] = by + dy * repel + Math.cos(t + by) * 0.012;
      arr[i3 + 2] = bz + Math.sin(t + bx + by) * 0.012;
    }
    mesh.geometry.attributes.position.needsUpdate = true;
    mesh.rotation.y = t * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9ef0ff"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.55}
      />
    </points>
  );
}



function BentoCard({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
    card.style.transform = `rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={cardRef}
      className={styles.bentoCard}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className={styles.bentoCardInner}>
        <div className="flex items-center gap-3 mb-3 text-teal-200">
          {icon}
          <span className="text-sm uppercase tracking-[0.2em]">{title}</span>
        </div>
        <p className="text-sm text-slate-200/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);

  useEffect(() => {
    if (!scrollRef.current || !contentRef.current) return;
    const lenis = new Lenis({ 
      wrapper: scrollRef.current,
      content: contentRef.current,
      smoothWheel: true, 
      lerp: 0.08 
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={scrollRef} className={`${styles.page} custom-scrollbar`}>

      <div className={styles.noise} />


      <div ref={contentRef} className={styles.overlay}>
        <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-orange-500">JAN</span>
              <span className="text-white">P</span>
              <span className="text-green-500">ATH</span>
            </span>
          </div>


        </nav>

        <motion.section
          className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center"
          style={{ y: heroY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className={`${styles.badge} mb-8`}>
            <Star size={14} className="text-yellow-300" />
            <span className="text-sm text-white/80">
              Surveyed by 40+ users to better serve you
            </span>
            <Activity size={14} className="text-emerald-300" />
          </motion.div>

          <motion.h1 variants={itemVariants} className={styles.heroTitle}>
            <span className="text-orange-500">JAN</span>
            <span className="text-white">P</span>
            <span className="text-green-500">ATH</span>
          </motion.h1>

          <motion.p variants={itemVariants} className={styles.subtitle}>
            Civic Grievance Intelligence Platform
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-base md:text-lg text-slate-200/70 max-w-3xl"
          >
            An immersive command layer for municipal response teams. Real-time
            data, secure workflows, and AI-driven insights wrapped in a
            cinematic interface.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            <Chip icon={<Zap size={16} />} text="Real-time Tracking" />
            <Chip icon={<ShieldCheck size={16} />} text="Secure Auth" />
            <Chip icon={<Globe size={16} />} text="Multi-district Support" />
            <Chip icon={<Users size={16} />} text="Citizen Insights" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center gap-5 w-full justify-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <div className="p-[2px] rounded-[22px] bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-400">
                <Link href="/auth/citizen">
                  <button className="px-8 py-4 rounded-[20px] bg-white/85 text-[#0b0814] font-semibold text-lg min-w-[220px] flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[0_10px_30px_rgba(255,255,255,0.2)] backdrop-blur-xl border border-white/60">
                    Access as Citizen <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <div className="p-[2px] rounded-[22px] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400">
                <Link href="/auth/admin">
                  <button className="px-8 py-4 rounded-[20px] bg-white/85 text-[#0b0814] font-semibold text-lg min-w-[200px] flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[0_10px_30px_rgba(255,255,255,0.2)] backdrop-blur-xl border border-white/60">
                    Access as Admin
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <div className="p-[2px] rounded-[22px] bg-gradient-to-r from-emerald-300 via-lime-300 to-sky-400">
                <Link href="/auth/worker">
                  <button className="px-8 py-4 rounded-[20px] bg-white/85 text-[#0b0814] font-semibold text-lg min-w-[200px] flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[0_10px_30px_rgba(255,255,255,0.2)] backdrop-blur-xl border border-white/60">
                    <Wrench size={18} />
                    Join as Worker
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className={styles.bentoGrid}>
            <BentoCard
              title="Live Ops"
              description="Monitor active grievance flows and route response teams with predictive load balancing."
              icon={<Radar size={18} />}
            />
            <BentoCard
              title="Neural Insights"
              description="Surface anomaly clusters, escalation patterns, and resolution bottlenecks in seconds."
              icon={<Cpu size={18} />}
            />
            <BentoCard
              title="Data Mesh"
              description="Securely stream data across departments with encrypted civic data lanes."
              icon={<Database size={18} />}
            />
            <BentoCard
              title="Trust Layer"
              description="Granular permissions, immutable audit trails, and policy-bound automations."
              icon={<ShieldCheck size={18} />}
            />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className={styles.statsCard}>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-slate-300">Users</div>
            </div>
            <div className={styles.statsCard}>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-slate-300">Uptime</div>
            </div>
            <div className={styles.statsCard}>
              <div className="text-2xl font-bold">150+</div>
              <div className="text-sm text-slate-300">Districts</div>
            </div>
            <div className={styles.statsCard}>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-slate-300">Support</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-white/80 backdrop-blur-md">
      {icon}
      <span>{text}</span>
    </div>
  );
}
