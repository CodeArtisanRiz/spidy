import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Trail, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

// 3D Spider Web Background Component
function SpiderWebBackground() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <>
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <mesh ref={meshRef} scale={2}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial
            color="#E23636"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#E23636" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#2B378C" />
    </>
  )
}

// Animated Web Line
function WebLine({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute bg-gradient-to-b from-transparent via-white/20 to-transparent"
      style={{
        width: '2px',
        height: '100vh',
        left: `${Math.random() * 100}%`,
      }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: [0, 0.5, 0] }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 5,
      }}
    />
  )
}

// Spider Icon Component
function SpiderIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`spider-spin ${className}`} viewBox="0 0 100 100" width="60" height="60">
      <defs>
        <linearGradient id="spiderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E23636" />
          <stop offset="100%" stopColor="#2B378C" />
        </linearGradient>
      </defs>
      {/* Spider body */}
      <ellipse cx="50" cy="50" rx="12" ry="15" fill="url(#spiderGrad)" />
      {/* Spider legs */}
      <g stroke="#E23636" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M40 40 Q 20 25, 10 30" />
        <path d="M45 35 Q 30 10, 20 15" />
        <path d="M55 35 Q 70 10, 80 15" />
        <path d="M60 40 Q 80 25, 90 30" />
        <path d="M40 60 Q 20 75, 10 70" />
        <path d="M45 65 Q 30 90, 20 85" />
        <path d="M55 65 Q 70 90, 80 85" />
        <path d="M60 60 Q 80 75, 90 70" />
      </g>
      {/* Eyes */}
      <ellipse cx="46" cy="45" rx="3" ry="4" fill="white" />
      <ellipse cx="54" cy="45" rx="3" ry="4" fill="white" />
      <circle cx="46" cy="45" r="1.5" fill="black" />
      <circle cx="54" cy="45" r="1.5" fill="black" />
    </svg>
  )
}

// Suit Card Component
function SuitCard({ title, description, color, icon }: { title: string; description: string; color: string; icon: string }) {
  return (
    <motion.div
      className="flip-card h-80 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flip-card-inner">
        <div className={`flip-card-front suit-card rounded-lg p-6 flex flex-col items-center justify-center`}
          style={{ borderColor: color }}>
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {icon}
          </motion.div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Bangers', color }}>{title}</h3>
          <p className="text-sm text-gray-400 text-center">Hover to reveal powers</p>
        </div>
        <div className={`flip-card-back suit-card rounded-lg p-6 flex flex-col items-center justify-center`}
          style={{ background: `linear-gradient(135deg, ${color}22, transparent)` }}>
          <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bangers', color }}>ABILITIES</h3>
          <p className="text-center text-white leading-relaxed">{description}</p>
          <motion.div
            className="mt-4 w-full h-1 rounded"
            style={{ background: color }}
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// Comic Speech Bubble
function SpeechBubble({ text, side = 'left' }: { text: string; side?: 'left' | 'right' }) {
  return (
    <motion.div
      className={`relative inline-block ${side === 'right' ? 'ml-auto' : ''}`}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="comic-panel px-6 py-4 max-w-md">
        <p className="text-black font-bold text-lg" style={{ fontFamily: 'Comic Neue' }}>{text}</p>
      </div>
      <div
        className={`absolute ${side === 'left' ? '-right-4' : '-left-4'} bottom-4 w-0 h-0`}
        style={{
          borderStyle: 'solid',
          borderWidth: side === 'left' ? '15px 0 15px 25px' : '15px 25px 15px 0',
          borderColor: side === 'left'
            ? 'transparent transparent transparent white'
            : 'transparent white transparent transparent',
        }}
      />
    </motion.div>
  )
}

// Main App Component
function App() {
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scaleX = useSpring(scrollYProgress, springConfig)

  // Scroll-based transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spider-loader" />
        <motion.p
          className="absolute mt-32 text-2xl font-bold"
          style={{ fontFamily: 'Bangers', color: '#E23636' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          SWINGING INTO ACTION...
        </motion.p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E23636] to-[#2B378C] z-50"
        style={{ scaleX, transformOrigin: 'left' }}
      />

      {/* Web Background Pattern */}
      <div className="web-pattern" />

      {/* Animated Web Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <WebLine key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* 3D Background Canvas */}
      <div className="fixed inset-0 z-[-1]">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <SpiderWebBackground />
        </Canvas>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.div
            className="mb-8"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SpiderIcon className="mx-auto w-32 h-32" />
          </motion.div>

          <motion.h1
            className="glitch mb-4"
            data-text="SPIDER-VERSE"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            SPIDER-VERSE
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Comic Neue' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            With great power comes great responsibility...
          </motion.p>

          <motion.button
            className="comic-button web-shoot"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => document.getElementById('suits')?.scrollIntoView({ behavior: 'smooth' })}
          >
            ENTER THE WEB
          </motion.button>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 border-4 border-[#E23636] rounded-full opacity-30"
          style={{ y: y1 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-br from-[#2B378C] to-transparent rounded-lg opacity-20"
          style={{ y: y2, rotate }}
        />
      </section>

      {/* Spider Suits Section */}
      <section id="suits" className="relative py-32 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          style={{ opacity }}
        >
          <motion.h2
            className="text-center mb-20 comic-burst"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            LEGENDARY SUITS
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <SuitCard
                title="CLASSIC SUIT"
                description="Web-shooters with impact webbing, spider-tracers, and enhanced strength. The original red and blue that started it all."
                color="#E23636"
                icon="🕷️"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <SuitCard
                title="SYMBIOTE SUIT"
                description="Alien symbiote grants shape-shifting, unlimited organic webbing, and enhanced abilities. Beware the darkness within."
                color="#1a1a1a"
                icon="👤"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <SuitCard
                title="IRON SPIDER"
                description="Tony Stark's gift features nano-tech armor, spider-arms, and instant kill mode. The ultimate evolution."
                color="#F4D03F"
                icon="🦾"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Abilities Section with Parallax */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-center mb-20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            SPIDER-ABILITIES
          </motion.h2>

          <div className="space-y-20">
            {/* Ability 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                className="flex-1"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                <SpeechBubble text="My spider-sense tingles! I can sense danger before it happens. It's like having a super-powered early warning system!" />
              </motion.div>
              <motion.div
                className="flex-1 flex justify-center"
                style={{ y: y1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#E23636] to-[#2B378C] flex items-center justify-center shadow-2xl">
                  <motion.span
                    className="text-6xl"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⚡
                  </motion.span>
                </div>
              </motion.div>
            </div>

            {/* Ability 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <motion.div
                className="flex-1"
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                <SpeechBubble text="Web-slinging through New York at 100mph! My web-shooters can hold 500 pounds and dissolve in 2 hours." side="right" />
              </motion.div>
              <motion.div
                className="flex-1 flex justify-center"
                style={{ y: y2 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#2B378C] to-[#E23636] flex items-center justify-center shadow-2xl">
                  <motion.span
                    className="text-6xl"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🕸️
                  </motion.span>
                </div>
              </motion.div>
            </div>

            {/* Ability 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                className="flex-1"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                <SpeechBubble text="Wall-crawling! I can stick to any surface using molecular attraction. Gravity is optional when you're Spider-Man!" />
              </motion.div>
              <motion.div
                className="flex-1 flex justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shadow-2xl border-4 border-[#E23636]">
                  <motion.span
                    className="text-6xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🧗
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            POWER STATS
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Strength', value: 90, icon: '💪', color: '#E23636' },
              { label: 'Speed', value: 95, icon: '⚡', color: '#F4D03F' },
              { label: 'Intelligence', value: 98, icon: '🧠', color: '#2B378C' },
              { label: 'Agility', value: 100, icon: '🤸', color: '#E23636' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="suit-card rounded-lg p-6 text-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 3 : -3 }}
              >
                <motion.div
                  className="text-4xl mb-3"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.icon}
                </motion.div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Bangers' }}>{stat.label}</h3>
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.value}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="mt-2 text-2xl font-bold" style={{ color: stat.color }}>{stat.value}%</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-32 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="comic-panel p-12 transform rotate-1">
            <motion.p
              className="text-3xl md:text-5xl font-bold text-black mb-6 glow-text"
              style={{ fontFamily: 'Changa One' }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              "WITH GREAT POWER COMES GREAT RESPONSIBILITY"
            </motion.p>
            <p className="text-xl text-gray-600" style={{ fontFamily: 'Comic Neue' }}>— Uncle Ben</p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-4 border-t-4 border-[#E23636]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <SpiderIcon className="mx-auto w-20 h-20" />
          </motion.div>

          <motion.p
            className="text-gray-400 mb-4"
            style={{ fontFamily: 'Comic Neue' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            This is a fan-made tribute to Spider-Man
          </motion.p>

          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {['🕷️', '🕸️', '🦸', '🏙️'].map((emoji, index) => (
              <motion.span
                key={index}
                className="text-3xl cursor-pointer"
                whileHover={{ scale: 1.5, y: -10 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ delay: index * 0.1, duration: 1, repeat: Infinity }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default App
