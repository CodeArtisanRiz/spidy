import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

// Spider-Verse Heroes with themed images
const HEROES = [
  {
    id: 'peter-classic',
    name: 'Peter Parker',
    alias: 'Spider-Man',
    universe: 'Earth-616',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop',
    color: '#E23636',
    description: 'Your friendly neighborhood Spider-Man. Bitten by a radioactive spider, Peter Parker has been protecting New York for over 60 years.',
    powers: ['Web-Shooters', 'Spider-Sense', 'Wall-Crawling', 'Super Strength', 'Agility'],
    firstAppearance: 'Amazing Fantasy #15 (1962)',
    actor: 'Tom Holland / Andrew Garfield / Tobey Maguire'
  },
  {
    id: 'miles',
    name: 'Miles Morales',
    alias: 'Spider-Man',
    universe: 'Earth-1610',
    image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8ef1?w=600&h=800&fit=crop',
    color: '#000000',
    description: 'A Brooklyn teenager with bio-electricity powers and the ability to camouflage. The star of Into the Spider-Verse.',
    powers: ['Bio-Electricity', 'Camouflage', 'Venom Blast', 'Spider-Sense', 'Wall-Crawling'],
    firstAppearance: 'Ultimate Fallout #4 (2011)',
    actor: 'Shameik Moore (Voice)'
  },
  {
    id: 'gwen',
    name: 'Gwen Stacy',
    alias: 'Spider-Woman',
    universe: 'Earth-65',
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&h=800&fit=crop',
    color: '#FF1493',
    description: 'In her dimension, Gwen was bitten by the radioactive spider. A drummer in a band and a fearless web-slinger.',
    powers: ['Web-Shooters', 'Spider-Sense', 'Wall-Crawling', 'Ballet Fighting Style'],
    firstAppearance: 'Edge of Spider-Verse #2 (2014)',
    actor: 'Hailee Steinfeld (Voice)'
  },
  {
    id: 'peter-b',
    name: 'Peter B. Parker',
    alias: 'Spider-Man Noir',
    universe: 'Earth-90214',
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=800&fit=crop',
    color: '#1a1a1a',
    description: 'A gritty 1930s detective version of Spider-Man. Uses guns and has a much darker approach to justice.',
    powers: ['Web-Shooters', 'Stealth', 'Marksmanship', 'Enhanced Senses'],
    firstAppearance: 'Spider-Man Noir #1 (2009)',
    actor: 'Nicolas Cage (Voice)'
  },
  {
    id: 'ham',
    name: 'Peter Porker',
    alias: 'Spider-Ham',
    universe: 'Earth-8311',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=800&fit=crop',
    color: '#FF6B6B',
    description: 'A spider that was bitten by a radioactive pig. A cartoon character with toon physics and infinite mallet space.',
    powers: ['Cartoon Physics', 'Toon Force', 'Mallet Space', 'Pork Sense'],
    firstAppearance: 'Marvel Tails #1 (1983)',
    actor: 'John Mulaney (Voice)'
  },
  {
    id: 'peni',
    name: 'Peni Parker',
    alias: 'SP//dr',
    universe: 'Earth-14512',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=800&fit=crop',
    color: '#FF4081',
    description: 'A 14-year-old Japanese-American pilot who bonds with a radioactive spider to control a giant mech suit.',
    powers: ['Mech Suit', 'Psychic Link', 'Advanced Technology', 'Neural Interface'],
    firstAppearance: 'Edge of Spider-Verse #5 (2014)',
    actor: 'Kimiko Glenn (Voice)'
  },
]

// Villains
const VILLAINS = [
  {
    id: 'kingpin',
    name: 'Wilson Fisk',
    alias: 'Kingpin',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop',
    color: '#FFFFFF',
    description: 'The criminal mastermind of New York. Immense strength and brilliant mind make him Spider-Man\'s most dangerous foe.',
    threat: 'Extreme',
    firstAppearance: 'The Amazing Spider-Man #50 (1967)'
  },
  {
    id: 'goblin',
    name: 'Norman Osborn',
    alias: 'Green Goblin',
    image: 'https://images.unsplash.com/photo-1598528882254-424ed83d397b?w=600&h=700&fit=crop',
    color: '#00FF00',
    description: 'The original and most personal villain. Enhanced strength, insane intelligence, and deadly pumpkin bombs.',
    threat: 'Critical',
    firstAppearance: 'The Amazing Spider-Man #14 (1964)'
  },
  {
    id: 'doc-ock',
    name: 'Otto Octavius',
    alias: 'Doctor Octopus',
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=600&h=700&fit=crop',
    color: '#4169E1',
    description: 'Brilliant scientist with four mechanical tentacles fused to his body. Nearly killed Spider-Man multiple times.',
    threat: 'High',
    firstAppearance: 'The Amazing Spider-Man #3 (1963)'
  },
  {
    id: 'venom',
    name: 'Eddie Brock',
    alias: 'Venom',
    image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&h=700&fit=crop',
    color: '#000000',
    description: 'An alien symbiote that gives its host all Spider-Man\'s powers plus shape-shifting and near-invulnerability.',
    threat: 'Critical',
    firstAppearance: 'The Amazing Spider-Man #300 (1988)'
  },
]

// Movies
const MOVIES = [
  { id: 1, title: 'Into the Spider-Verse', year: 2018, rating: 'PG', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop', director: 'Bob Persichetti', quote: 'What makes you different is what makes you Spider-Man' },
  { id: 2, title: 'Spider-Man (2002)', year: 2002, rating: 'PG-13', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=450&fit=crop', director: 'Sam Raimi', quote: 'With great power comes great responsibility' },
  { id: 3, title: 'Spider-Man 2', year: 2004, rating: 'PG-13', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop', director: 'Sam Raimi', quote: 'Sometimes to do what\'s right, we have to be steady' },
  { id: 4, title: 'No Way Home', year: 2021, rating: 'PG-13', image: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=800&h=450&fit=crop', director: 'Jon Watts', quote: 'The multiverse is real' },
  { id: 5, title: 'Across the Spider-Verse', year: 2023, rating: 'PG', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop', director: 'Joaquim Dos Santos', quote: 'I can\'t lose one more friend!' },
  { id: 6, title: 'Homecoming', year: 2017, rating: 'PG-13', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=450&fit=crop', director: 'Jon Watts', quote: 'I\'m just a friendly neighborhood Spider-Man' },
]

// 3D Background Component
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

// Mouse follower glow effect
function MouseGlow() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(226, 54, 54, 0.15), transparent 40%)`

  return <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background }} />
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
      <ellipse cx="50" cy="50" rx="12" ry="15" fill="url(#spiderGrad)" />
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
      <ellipse cx="46" cy="45" rx="3" ry="4" fill="white" />
      <ellipse cx="54" cy="45" rx="3" ry="4" fill="white" />
      <circle cx="46" cy="45" r="1.5" fill="black" />
      <circle cx="54" cy="45" r="1.5" fill="black" />
    </svg>
  )
}

// 3D Tilt Card
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      className={className}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Character Card
function CharacterCard({ character, onClick, isSelected }: { character: typeof HEROES[0]; onClick: () => void; isSelected: boolean }) {
  return (
    <TiltCard className="cursor-pointer" onClick={onClick}>
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gray-900 border-4"
        style={{ borderColor: character.color }}
        whileHover={{ scale: 1.02 }}
        layoutId={`character-${character.id}`}
      >
        <div className="relative h-80 overflow-hidden">
          <motion.img
            src={character.image}
            alt={character.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          <motion.div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: character.color, color: 'white' }}
          >
            {character.universe}
          </motion.div>

          <motion.div
            className="absolute inset-0 opacity-0"
            whileHover={{ opacity: 1 }}
            style={{
              background: `radial-gradient(circle at 50% 50%, ${character.color}40, transparent 70%)`,
            }}
          />
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold mb-1" style={{ color: character.color, fontFamily: 'Bangers' }}>
            {character.alias}
          </h3>
          <p className="text-gray-400 text-sm mb-3">{character.name}</p>

          <div className="flex flex-wrap gap-2">
            {character.powers.slice(0, 3).map((power, idx) => (
              <span
                key={power}
                className="px-2 py-1 text-xs rounded-full border"
                style={{ borderColor: character.color, color: character.color }}
              >
                {power}
              </span>
            ))}
          </div>
        </div>

        {isSelected && (
          <motion.div
            className="absolute inset-0 border-4 border-white rounded-xl"
            layoutId="selection-indicator"
          />
        )}
      </motion.div>
    </TiltCard>
  )
}

// Villain Card
function VillainCard({ villain }: { villain: typeof VILLAINS[0] }) {
  return (
    <TiltCard>
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gray-900 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="relative h-72 overflow-hidden">
          <motion.img
            src={villain.image}
            alt={villain.alias}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <motion.div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: villain.threat === 'Critical' ? '#DC2626' : villain.threat === 'Extreme' ? '#7C3AED' : '#F59E0B',
              color: 'white'
            }}
          >
            {villain.threat} THREAT
          </motion.div>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold mb-1" style={{ color: villain.color, fontFamily: 'Bangers' }}>
            {villain.alias}
          </h3>
          <p className="text-gray-500 text-sm mb-2">{villain.name}</p>
          <p className="text-gray-400 text-sm line-clamp-2">{villain.description}</p>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: villain.color }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </TiltCard>
  )
}

// Movie Card
function MovieCard({ movie, index }: { movie: typeof MOVIES[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-900">
        <motion.img
          src={movie.image}
          alt={movie.title}
          className="w-full aspect-video object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        />

        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <motion.p
            className="text-yellow-400 text-xs mb-1"
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            "{movie.quote}"
          </motion.p>
          <motion.h3
            className="text-xl font-bold mb-1"
            style={{ fontFamily: 'Bangers' }}
            animate={{ y: isHovered ? 0 : 5 }}
          >
            {movie.title}
          </motion.h3>
          <motion.div
            className="flex items-center gap-2 text-sm text-gray-300"
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          >
            <span>{movie.year}</span>
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            <span>{movie.director}</span>
            <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">{movie.rating}</span>
          </motion.div>
        </div>

        <svg className="absolute top-0 right-0 w-24 h-24 opacity-30" viewBox="0 0 100 100">
          <path d="M100 0 L0 100 M100 20 L20 100 M100 40 L40 100 M100 60 L60 100 M100 80 L80 100" stroke="#E23636" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </motion.div>
  )
}

// Interactive spider web canvas
function InteractiveWeb({ mousePos }: { mousePos: { x: number, y: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const points: { x: number, y: number, vx: number, vy: number }[] = []
    const numPoints = 50

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      points.forEach((point, i) => {
        point.x += point.vx
        point.y += point.vy

        if (point.x < 0 || point.x > canvas.width) point.vx *= -1
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1

        const dx = mousePos.x - point.x
        const dy = mousePos.y - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          point.vx += dx * 0.0001
          point.vy += dy * 0.0001
        }

        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(226, 54, 54, 0.6)'
        ctx.fill()

        points.slice(i + 1).forEach((other) => {
          const d = Math.sqrt((point.x - other.x) ** 2 + (point.y - other.y) ** 2)
          if (d < 150) {
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(226, 54, 54, ${0.3 * (1 - d / 150)})`
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [mousePos])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />
}

// Lightbox modal
function Lightbox({ image, title, onClose }: { image: string, title: string, onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={image} alt={title} className="w-full rounded-lg shadow-2xl" />
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-4xl hover:text-red-500 transition-colors"
        >
          ×
        </button>
        <h3 className="mt-4 text-2xl text-center" style={{ fontFamily: 'Bangers', color: '#E23636' }}>{title}</h3>
      </motion.div>
    </motion.div>
  )
}

// Main App Component
function App() {
  const [loading, setLoading] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState<typeof HEROES[0] | null>(null)
  const [lightboxImage, setLightboxImage] = useState<{ image: string, title: string } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scaleX = useSpring(scrollYProgress, springConfig)

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <SpiderIcon className="w-24 h-24" />
        </motion.div>
        <motion.p
          className="absolute mt-32 text-2xl font-bold"
          style={{ fontFamily: 'Bangers', color: '#E23636' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          SWINGING INTO THE SPIDER-VERSE...
        </motion.p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E23636] to-[#2B378C] z-50"
        style={{ scaleX, transformOrigin: 'left' }}
      />

      {/* Mouse glow effect */}
      <MouseGlow />

      {/* Interactive Web Background */}
      <InteractiveWeb mousePos={mousePos} />

      {/* Animated Web Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <WebLine key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-[-2]">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <SpiderWebBackground />
        </Canvas>
      </div>

      {/* Hero Section - Restored Better Version */}
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

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="comic-button web-shoot"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => document.getElementById('heroes')?.scrollIntoView({ behavior: 'smooth' })}
            >
              MEET THE HEROES
            </motion.button>
            <motion.button
              className="comic-button"
              style={{ background: 'linear-gradient(135deg, #2B378C, #1a1a5e)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => document.getElementById('villains')?.scrollIntoView({ behavior: 'smooth' })}
            >
              FACE THE VILLAINS
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border-4 border-[#E23636] rounded-full opacity-20"
          style={{ y: y1 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-br from-[#2B378C] to-transparent rounded-lg opacity-10"
          style={{ y: y2, rotate }}
        />
      </section>

      {/* Heroes Section */}
      <section id="heroes" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-center mb-4 comic-burst"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            THE SPIDER-VERSE
          </motion.h2>
          <motion.p
            className="text-center text-gray-400 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Multiple dimensions. Infinite possibilities. One amazing Spider-Family.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HEROES.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => {
                  setSelectedCharacter(character)
                  setLightboxImage({ image: character.image, title: character.alias })
                }}
                isSelected={selectedCharacter?.id === character.id}
              />
            ))}
          </div>

          {/* Selected Character Detail */}
          <AnimatePresence>
            {selectedCharacter && (
              <motion.div
                className="mt-16 p-8 rounded-2xl bg-gray-900/90 border-2 border-red-600 backdrop-blur-sm"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <motion.img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className="w-full md:w-64 h-80 object-cover rounded-lg"
                    layoutId={`detail-image-${selectedCharacter.id}`}
                  />
                  <div className="flex-1">
                    <h3 className="text-4xl font-bold mb-2" style={{ color: selectedCharacter.color, fontFamily: 'Bangers' }}>
                      {selectedCharacter.alias}
                    </h3>
                    <p className="text-xl text-gray-300 mb-1">{selectedCharacter.name}</p>
                    <p className="text-gray-500 mb-4">{selectedCharacter.universe} • {selectedCharacter.actor}</p>
                    <p className="text-gray-300 mb-6 leading-relaxed">{selectedCharacter.description}</p>

                    <div className="mb-4">
                      <h4 className="text-lg font-bold mb-3" style={{ fontFamily: 'Bangers' }}>SUPER POWERS</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCharacter.powers.map((power) => (
                          <motion.span
                            key={power}
                            className="px-3 py-1 rounded-full text-sm font-bold"
                            style={{ backgroundColor: selectedCharacter.color, color: 'white' }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {power}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">First Appearance: {selectedCharacter.firstAppearance}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Villains Section */}
      <section id="villains" className="relative py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-center mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{ color: '#DC2626' }}
          >
            THE ROGUES GALLERY
          </motion.h2>
          <motion.p
            className="text-center text-gray-400 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            New York's most dangerous criminals. Every hero needs a great villain.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VILLAINS.map((villain) => (
              <VillainCard key={villain.id} villain={villain} />
            ))}
          </div>
        </div>
      </section>

      {/* Movies Gallery */}
      <section id="movies" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-center mb-16"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            CINEMATIC MASTERPIECES
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOVIES.map((movie, index) => (
              <motion.div
                key={movie.id}
                className={index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
                onClick={() => setLightboxImage({ image: movie.image, title: movie.title })}
              >
                <MovieCard movie={movie} index={index} />
              </motion.div>
            ))}
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
            BY THE NUMBERS
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Spider-Verse Heroes', value: 100, suffix: '+', icon: '🕷️', color: '#E23636' },
              { label: 'Comic Issues', value: 2500, suffix: '+', icon: '📚', color: '#2B378C' },
              { label: 'Live-Action Movies', value: 11, suffix: '', icon: '🎬', color: '#F4D03F' },
              { label: 'Years of Web', value: 62, suffix: '', icon: '🎂', color: '#E23636' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.p
                  className="text-5xl font-bold mb-2"
                  style={{ color: stat.color, fontFamily: 'Bangers' }}
                >
                  {stat.value}{stat.suffix}
                </motion.p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-32 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center relative"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute -left-20 top-0 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.5, 1], x: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -right-20 bottom-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.5, 1], x: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />

          <div className="comic-panel p-12 relative z-10">
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
            className="text-gray-400 mb-8"
            style={{ fontFamily: 'Comic Neue' }}
          >
            A fan-made tribute to Spider-Man and the entire Spider-Verse
          </motion.p>

          <motion.div className="flex justify-center gap-6">
            {['🕷️', '🕸️', '🦸', '🏙️', '📱'].map((emoji, index) => (
              <motion.span
                key={index}
                className="text-4xl cursor-pointer"
                whileHover={{ scale: 1.5, y: -10 }}
                animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                transition={{ delay: index * 0.1, duration: 1, repeat: Infinity }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <Lightbox
            image={lightboxImage.image}
            title={lightboxImage.title}
            onClose={() => setLightboxImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
