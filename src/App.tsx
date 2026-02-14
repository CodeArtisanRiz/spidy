import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

// Spiderman character data with images
const SPIDER_VERSE_CHARACTERS = [
  {
    id: 'peter-classic',
    name: 'Peter Parker',
    alias: 'Classic Spider-Man',
    universe: 'Earth-616',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop',
    color: '#E23636',
    description: 'The original web-slinger. Bitten by a radioactive spider, Peter Parker became the hero we all know and love.',
    powers: ['Web-Shooters', 'Spider-Sense', 'Wall-Crawling', 'Super Strength'],
    firstAppearance: 'Amazing Fantasy #15 (1962)',
  },
  {
    id: 'miles',
    name: 'Miles Morales',
    alias: 'Ultimate Spider-Man',
    universe: 'Earth-1610',
    image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8ef1?w=600&h=800&fit=crop',
    color: '#000000',
    description: 'A teenager from Brooklyn who was bitten by a radioactive spider from Oscorp. He has electric venom sting and camouflage abilities.',
    powers: ['Bio-Electricity', 'Camouflage', 'Venom Blast', 'Spider-Camouflage'],
    firstAppearance: 'Ultimate Fallout #4 (2011)',
  },
  {
    id: 'gwen',
    name: 'Gwen Stacy',
    alias: 'Spider-Gwen',
    universe: 'Earth-65',
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&h=800&fit=crop',
    color: '#FF1493',
    description: 'In her universe, Gwen was bitten by the radioactive spider instead of Peter. She uses web-shooters and drums in a band.',
    powers: ['Web-Shooters', 'Spider-Sense', 'Wall-Crawling', 'Musical Talent'],
    firstAppearance: 'Edge of Spider-Verse #2 (2014)',
  },
  {
    id: 'ham',
    name: 'Peter Porker',
    alias: 'Spider-Ham',
    universe: 'Earth-8311',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=800&fit=crop',
    color: '#FF6B6B',
    description: 'A spider bitten by a radioactive pig who became a porcine parody of Spider-Man. Yes, this is real and amazing!',
    powers: ['Cartoon Physics', 'Mallet Space', 'Toon Force', 'Pork Sense'],
    firstAppearance: 'Marvel Tails #1 (1983)',
  },
  {
    id: ' Noir',
    name: 'Peter Parker',
    alias: 'Spider-Man Noir',
    universe: 'Earth-90214',
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=800&fit=crop',
    color: '#1a1a1a',
    description: 'A 1930s version of Spider-Man operating during the Great Depression. Uses guns and has a much darker tone.',
    powers: ['Web-Shooters', 'Enhanced Agility', 'Marksmanship', 'Stealth'],
    firstAppearance: 'Spider-Man Noir #1 (2009)',
  },
  {
    id: 'peni',
    name: 'Peni Parker',
    alias: 'SP//dr',
    universe: 'Earth-14512',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=800&fit=crop',
    color: '#FF4081',
    description: 'A Japanese-American girl who pilots a spider-mech suit powered by a radioactive spider with whom she shares a psychic link.',
    powers: ['Mech Suit', 'Psychic Link', 'Advanced Tech', 'Acrobatics'],
    firstAppearance: 'Edge of Spider-Verse #5 (2014)',
  },
]

// Movie gallery data
const MOVIES = [
  { id: 1, title: 'Spider-Man (2002)', rating: 'PG-13', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=450&fit=crop', director: 'Sam Raimi', year: 2002 },
  { id: 2, title: 'Spider-Man 2 (2004)', rating: 'PG-13', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop', director: 'Sam Raimi', year: 2004 },
  { id: 3, title: 'Spider-Man 3 (2007)', rating: 'PG-13', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop', director: 'Sam Raimi', year: 2007 },
  { id: 4, title: 'The Amazing Spider-Man', rating: 'PG-13', image: 'https://images.unsplash.com/photo-1560167016-022b78a0258e?w=800&h=450&fit=crop', director: 'Marc Webb', year: 2012 },
  { id: 5, title: 'Spider-Man: Homecoming', rating: 'PG-13', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=450&fit=crop', director: 'Jon Watts', year: 2017 },
  { id: 6, title: 'Spider-Verse (2018)', rating: 'PG', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop', director: 'Bob Persichetti', year: 2018 },
  { id: 7, title: 'Far From Home (2019)', rating: 'PG-13', image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=450&fit=crop', director: 'Jon Watts', year: 2019 },
  { id: 8, title: 'No Way Home (2021)', rating: 'PG-13', image: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=800&h=450&fit=crop', director: 'Jon Watts', year: 2021 },
]

// Comic book covers gallery
const COMIC_COVERS = [
  { id: 1, title: 'Amazing Fantasy #15', year: 1962, image: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400&h=600&fit=crop' },
  { id: 2, title: 'The Amazing Spider-Man #1', year: 1963, image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop' },
  { id: 3, title: 'The Night Gwen Stacy Died', year: 1973, image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop' },
  { id: 4, title: 'Secret Wars #8', year: 1984, image: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=600&fit=crop' },
  { id: 5, title: 'Spider-Man #1 (Todd McFarlane)', year: 1990, image: 'https://images.unsplash.com/photo-1624213111452-35e8d3d5cc18?w=400&h=600&fit=crop' },
  { id: 6, title: 'Ultimate Spider-Man #1', year: 2000, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop' },
  { id: 7, title: 'Superior Spider-Man #1', year: 2013, image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop' },
  { id: 8, title: 'Spider-Gwen #1', year: 2015, image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=400&h=600&fit=crop' },
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

// Character Card with 3D tilt effect
function CharacterCard({ character, onClick, isSelected }: { character: typeof SPIDER_VERSE_CHARACTERS[0], onClick: () => void, isSelected: boolean }) {
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
      className="relative cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      layoutId={`character-${character.id}`}
    >
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gray-900 border-4"
        style={{
          borderColor: character.color,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Character Image */}
        <div className="relative h-80 overflow-hidden">
          <motion.img
            src={character.image}
            alt={character.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Universe badge */}
          <motion.div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: character.color, color: 'white' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {character.universe}
          </motion.div>

          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0"
            whileHover={{ opacity: 1 }}
            style={{
              background: `radial-gradient(circle at 50% 50%, ${character.color}40, transparent 70%)`,
            }}
          />
        </div>

        {/* Character Info */}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-1" style={{ color: character.color, fontFamily: 'Bangers' }}>
            {character.alias}
          </h3>
          <p className="text-gray-400 text-sm mb-3">{character.name}</p>

          {/* Powers pills */}
          <div className="flex flex-wrap gap-2">
            {character.powers.slice(0, 3).map((power, idx) => (
              <motion.span
                key={power}
                className="px-2 py-1 text-xs rounded-full border"
                style={{ borderColor: character.color, color: character.color }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {power}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 border-4 border-white rounded-xl"
            layoutId="selection-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

// Movie poster with hover effects
function MoviePoster({ movie, index }: { movie: typeof MOVIES[0], index: number }) {
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
        {/* Poster Image */}
        <motion.img
          src={movie.image}
          alt={movie.title}
          className="w-full aspect-video object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        />

        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <motion.h3
            className="text-xl font-bold mb-1"
            style={{ fontFamily: 'Bangers' }}
            animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
          >
            {movie.title}
          </motion.h3>

          <motion.div
            className="flex items-center gap-3 text-sm text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          >
            <span>{movie.year}</span>
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            <span>{movie.director}</span>
            <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">{movie.rating}</span>
          </motion.div>
        </div>

        {/* Spider web corner decoration */}
        <svg className="absolute top-0 right-0 w-24 h-24 opacity-30" viewBox="0 0 100 100">
          <path d="M100 0 L0 100 M100 20 L20 100 M100 40 L40 100 M100 60 L60 100 M100 80 L80 100" stroke="#E23636" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </motion.div>
  )
}

// Comic cover with 3D flip
function ComicCover({ comic, index }: { comic: typeof COMIC_COVERS[0], index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, rotateY: -90 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <img src={comic.image} alt={comic.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-yellow-400 text-xs font-bold">{comic.year}</p>
            <h4 className="text-white font-bold text-sm" style={{ fontFamily: 'Bangers' }}>{comic.title}</h4>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-red-600 to-blue-800 p-4 flex flex-col items-center justify-center text-center"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <span className="text-4xl mb-4">🕷️</span>
          <p className="text-white text-sm">Click to view details</p>
          <p className="text-yellow-300 text-xs mt-2">Rare Edition</p>
        </div>
      </motion.div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)',
        }}
        animate={{ x: isFlipped ? '200%' : '-200%' }}
        transition={{ duration: 0.6 }}
      />
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

      // Update points
      points.forEach((point, i) => {
        point.x += point.vx
        point.y += point.vy

        if (point.x < 0 || point.x > canvas.width) point.vx *= -1
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1

        // Mouse attraction
        const dx = mousePos.x - point.x
        const dy = mousePos.y - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          point.vx += dx * 0.0001
          point.vy += dy * 0.0001
        }

        // Draw point
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(226, 54, 54, 0.6)'
        ctx.fill()

        // Draw connections
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
  const [selectedCharacter, setSelectedCharacter] = useState<typeof SPIDER_VERSE_CHARACTERS[0] | null>(null)
  const [lightboxImage, setLightboxImage] = useState<{ image: string, title: string } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [activeSection, setActiveSection] = useState('heroes')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scaleX = useSpring(scrollYProgress, springConfig)

  // Scroll-based transforms
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
        <div className="spider-loader" />
        <motion.p
          className="absolute mt-32 text-2xl font-bold"
          style={{ fontFamily: 'Bangers', color: '#E23636' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ASSEMBLING THE SPIDER-VERSE...
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

      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-[-2]">
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
          {/* Animated Spider Logo */}
          <motion.div
            className="mb-8 relative"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.svg
              viewBox="0 0 200 200"
              className="w-40 h-40 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <defs>
                <linearGradient id="spiderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E23636" />
                  <stop offset="100%" stopColor="#2B378C" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="none" stroke="url(#spiderGrad)" strokeWidth="4" />
              <path d="M100 20 L100 180 M20 100 L180 100 M40 40 L160 160 M40 160 L160 40" stroke="#E23636" strokeWidth="2" opacity="0.5" />
              <text x="100" y="115" textAnchor="middle" fill="url(#spiderGrad)" fontSize="60" fontFamily="Bangers">🕷️</text>
            </motion.svg>
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
            Explore every dimension. Meet every Spider-Person. Experience the web.
          </motion.p>

          {/* Navigation pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {['heroes', 'movies', 'comics'].map((section) => (
              <motion.button
                key={section}
                className={`px-6 py-3 rounded-full font-bold text-lg uppercase ${activeSection === section ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                style={{ fontFamily: 'Bangers' }}
                onClick={() => {
                  setActiveSection(section)
                  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {section}
              </motion.button>
            ))}
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

      {/* Spider-Verse Characters Section */}
      <section id="heroes" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-center mb-16 comic-burst"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            THE SPIDER-VERSE
          </motion.h2>

          {/* Character Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SPIDER_VERSE_CHARACTERS.map((character) => (
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
                className="mt-16 p-8 rounded-2xl bg-gray-900/80 border-2 border-red-600"
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
                    <h3 className="text-3xl font-bold mb-2" style={{ color: selectedCharacter.color, fontFamily: 'Bangers' }}>
                      {selectedCharacter.alias}
                    </h3>
                    <p className="text-xl text-gray-300 mb-4">{selectedCharacter.name} • {selectedCharacter.universe}</p>
                    <p className="text-gray-400 mb-6">{selectedCharacter.description}</p>
                    <div className="mb-4">
                      <h4 className="text-lg font-bold mb-2" style={{ fontFamily: 'Bangers' }}>POWERS</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCharacter.powers.map((power) => (
                          <span
                            key={power}
                            className="px-3 py-1 rounded-full text-sm font-bold"
                            style={{ backgroundColor: selectedCharacter.color, color: 'white' }}
                          >
                            {power}
                          </span>
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
            CINEMATIC UNIVERSE
          </motion.h2>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOVIES.map((movie, index) => (
              <motion.div
                key={movie.id}
                className={index % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                onClick={() => setLightboxImage({ image: movie.image, title: movie.title })}
              >
                <MoviePoster movie={movie} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comics Gallery */}
      <section id="comics" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-center mb-16"
            initial={{ opacity: 0, rotateX: -90 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
          >
            LEGENDARY COMICS
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {COMIC_COVERS.map((comic, index) => (
              <motion.div
                key={comic.id}
                onClick={() => setLightboxImage({ image: comic.image, title: comic.title })}
              >
                <ComicCover comic={comic} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Stats Section */}
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
              { label: 'Spider-People', value: 100, suffix: '+', icon: '🕷️', color: '#E23636' },
              { label: 'Comic Issues', value: 2500, suffix: '+', icon: '📚', color: '#2B378C' },
              { label: 'Movies', value: 11, suffix: '', icon: '🎬', color: '#F4D03F' },
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
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
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
      <section className="relative py-32 px-4 overflow-hidden">
        <motion.div
          className="max-w-4xl mx-auto text-center relative"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated background shapes */}
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
            <span className="text-6xl">🕷️</span>
          </motion.div>

          <motion.p
            className="text-gray-400 mb-8"
            style={{ fontFamily: 'Comic Neue' }}
          >
            A fan-made tribute to the Web-Slinger and the entire Spider-Verse
          </motion.p>

          <motion.div
            className="flex justify-center gap-6"
          >
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
