
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Trophy, Target, Zap, DollarSign, Lock, Gamepad2, Skull, Map } from 'lucide-react'

// GTA Style Assets - Reliable High-Quality URLs
const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1605218427306-6354db696f98?auto=format&fit=crop&q=80&w=1920", // Gaming/Hacker
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920", // Exotic Car
  "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=1920", // Night City
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920", // Cyberpunk
]

// UPDATED: Using very reliable, popular images for stability
const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800", // The Plan (Tech/Retro)
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800", // The Stash (Money/Gold - Verified)
    "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?auto=format&fit=crop&q=80&w=800", // Safehouse (Abstract/Data)
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800", // R & R (Gaming/Controller - Verified)
]

export default function Landing() {
  const [currentBg, setCurrentBg] = useState(0)
  const [loading, setLoading] = useState(true)

  // Cycle Backgrounds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BACKGROUNDS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans text-white cursor-none">
      
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Intro Loading Screen */}
      <AnimatePresence>
        {loading && <IntroOverlay onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* KEN BURNS BACKGROUND SLIDESHOW */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence>
          <motion.img
            key={currentBg}
            src={BACKGROUNDS[currentBg]}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        </AnimatePresence>
        {/* Vignette & Grain Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      </div>

      {/* Navbar (Minimal, Floating) */}
      <nav className="fixed top-0 z-50 w-full px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <motion.div 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 3.5, type: 'spring' }}
            className="flex items-center gap-2"
        >
            <div className="h-10 w-10 bg-white text-black flex items-center justify-center font-black text-2xl rounded-sm border-2 border-black transform -skew-x-12 shadow-[4px_4px_0px_rgba(255,255,0,1)] hover:bg-yellow-400 transition-colors">
                N
            </div>
            <span className="hidden md:block font-['Anton'] text-2xl tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                NEXUS
            </span>
        </motion.div>
        <Link 
            to="/login"
            className="group relative px-6 py-2 bg-yellow-400 text-black font-black uppercase tracking-wider transform skew-x-[-10deg] hover:bg-white transition-colors border-2 border-black"
        >
            <span className="block transform skew-x-[10deg]">Join The Crew</span>
        </Link>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-start justify-center min-h-screen px-6 md:px-20 lg:px-32 pb-20 pt-32">
        <motion.div
           initial={{ x: -100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ duration: 0.8, delay: 3.8 }}
        >
            <h2 className="font-['Anton'] text-yellow-400 text-xl md:text-2xl tracking-[0.2em] uppercase mb-2 drop-shadow-md bg-black/50 inline-block px-2">
                The Score Is Set
            </h2>
            <h1 className="font-['Anton'] text-7xl md:text-9xl leading-[0.85] text-white drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] stroke-black hover:scale-105 transition-transform origin-left">
                YOUR LIFE<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 stroke-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">ORGANIZED</span>
            </h1>
        </motion.div>

        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.2, duration: 1 }}
            className="mt-8 max-w-xl text-lg md:text-xl font-medium text-white/90 drop-shadow-md bg-black/60 p-6 rounded-r-xl border-l-8 border-yellow-400 backdrop-blur-sm"
        >
            Manage your empire. Track your stash. Hit your targets. <br/>
            The ultimate productivity tool for the modern hustler.
        </motion.p>
        
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 4.5, type: 'spring' }}
            className="mt-10 flex flex-wrap gap-4"
        >
            <Link to="/login" className="px-8 py-4 bg-white text-black font-['Anton'] text-xl uppercase tracking-widest hover:bg-yellow-400 hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] border-2 border-transparent hover:border-black">
                Start Mission
            </Link>
        </motion.div>

        {/* Floating "Loading" Stats */}
        <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 5, type: 'spring' }}
            className="absolute bottom-10 right-10 hidden md:block w-72"
        >
           <div className="bg-black/80 backdrop-blur-md p-6 border border-white/20 transform -rotate-1 shadow-2xl skew-y-1 hover:rotate-0 hover:skew-y-0 transition-all duration-300 cursor-none">
              <h3 className="font-['Anton'] text-2xl text-yellow-500 mb-4 uppercase tracking-wider border-b border-white/10 pb-2">Current Status</h3>
              <div className="space-y-4">
                 <StatBar label="Efficiency" value="98%" color="bg-green-500" />
                 <StatBar label="Heat Level" value="0%" color="bg-blue-500" />
                 <StatBar label="Cash Flow" value="$1M+" color="bg-green-500" />
                 <StatBar label="Reputation" value="MAX" color="bg-purple-500" />
              </div>
           </div>
        </motion.div>
      </main>

      {/* Features "Heist Board" Section */}
      <section className="relative z-10 bg-zinc-900 py-24 px-6 md:px-20 border-t-8 border-yellow-400">
         <div className="max-w-7xl mx-auto">
            <h2 className="font-['Anton'] text-5xl md:text-7xl text-white mb-16 text-center uppercase tracking-tighter drop-shadow-[4px_4px_0px_#000]">
                Choose Your Loadout
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                    img={GALLERY_IMAGES[0]}
                    title="The Plan" 
                    icon={Target}
                    desc="Task management that hits the mark every time."
                    delay={0}
                />
                <FeatureCard 
                    img={GALLERY_IMAGES[1]}
                    title="The Stash" 
                    icon={DollarSign}
                    desc="Track every cent. Build your fortune."
                    delay={0.2}
                />
                <FeatureCard 
                    img={GALLERY_IMAGES[2]}
                    title="Safehouse" 
                    icon={Lock}
                    desc="Encrypted vault for your most sensitive intel."
                    delay={0.4}
                />
                <FeatureCard 
                    img={GALLERY_IMAGES[3]}
                    title="R & R" 
                    icon={Gamepad2}
                    desc="Chill in the break room when the heat is off."
                    delay={0.6}
                />
            </div>
         </div>
      </section>

      {/* NEW: The Operations (How it Works) */}
      <section className="relative z-10 bg-black py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row items-center gap-12">
                 <div className="md:w-1/2">
                    <motion.h2 
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="font-['Anton'] text-5xl text-yellow-500 mb-8 uppercase"
                    >
                        How It Goes Down
                    </motion.h2>
                    <div className="space-y-8">
                        <OperationStep number="01" title="Initial Setup" desc="Secure your account. Configure your safehouse. Set your targets." />
                        <OperationStep number="02" title="Execute" desc="Grind through tasks. Clock in hours. Watch the progress bar fill up." />
                        <OperationStep number="03" title="Get Paid" desc="Visualize your earnings. Analyze the data. Expand your empire." />
                    </div>
                 </div>
                 <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="md:w-1/2 relative h-96 w-full rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 group"
                 >
                    {/* Placeholder for Map/Interface UI */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577017040065-650ee4d43339?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Map className="h-24 w-24 text-white/20 group-hover:text-yellow-400 transition-colors duration-500 animate-pulse" />
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 border border-white/20">
                        <span className="text-yellow-400 font-mono text-xs">LOC: LOS SANTOS</span>
                    </div>
                 </motion.div>
             </div>
          </div>
      </section>


      {/* NEW: Global Stats */}
      <section className="relative z-10 bg-yellow-400 py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatItem value="10k+" label="Operatives" delay={0} />
              <StatItem value="$500M" label="Money Managed" delay={0.2} />
              <StatItem value="1M+" label="Tasks Executed" delay={0.4} />
              <StatItem value="24/7" label="Uptime" delay={0.6} />
          </div>
      </section>

      {/* NEW: Meet The Crew */}
      <section className="relative z-10 bg-zinc-900 py-24 px-6 border-t-8 border-black">
          <div className="max-w-7xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-['Anton'] text-5xl md:text-7xl text-white mb-16 text-center uppercase tracking-tighter"
              >
                  Meet The Crew
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <CrewMember 
                    name="Lester" 
                    role="Tech Mastermind" 
                    img="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=800" 
                  />
                  <CrewMember 
                    name="Paige" 
                    role="Ops Manager" 
                    img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                  />
                  <CrewMember 
                    name="Agent 14" 
                    role="The Fixer" 
                    img="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
                  />
              </div>
          </div>
      </section>

      {/* "Street Cred" Reviews Section */}
      <section className="relative z-10 bg-cover bg-center py-24 px-6 border-t-8 border-yellow-400" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-matter.png')`, backgroundColor: '#1a1a1a' }}>
         <div className="max-w-5xl mx-auto text-center">
             <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="font-['Anton'] text-5xl md:text-6xl text-white mb-12 uppercase tracking-wide"
             >
                 Street Cred
             </motion.h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ReviewCard 
                    name="Franklin C." 
                    role="Entrepreneur" 
                    quote="Nexus Pro changed the game. I moved my assets, cleaned my cash, and built an empire. 5 stars."
                    delay={0}
                />
                 <ReviewCard 
                    name="Michael T." 
                    role="Retired Professional" 
                    quote="Finally, a system that keeps me organized. No more loose ends. No more amateur mistakes."
                    delay={0.2}
                />
                 <ReviewCard 
                    name="Trevor P." 
                    role="CEO, TPI" 
                    quote="IT WORKS! I TRACK EVERYTHING! MY CUSTOMERS, MY STOCK, MY... OTHER STUFF!!"
                    delay={0.4}
                />
             </div>
         </div>
      </section>

      {/* CTA Footer */}
      <section className="relative z-10 bg-yellow-400 py-20 text-center border-t-4 border-black">
          <div className="max-w-3xl mx-auto px-6">
              <motion.h2 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-['Anton'] text-6xl text-black mb-6 uppercase leading-none"
              >
                  Ready to make <br/> moves?
              </motion.h2>
              <Link to="/login" className="inline-block bg-black text-white font-['Anton'] text-2xl uppercase px-10 py-5 hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl">
                  Get Started Now
              </Link>
          </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black py-12 text-center border-t border-zinc-800">
          <p className="font-['Anton'] text-zinc-600 text-lg tracking-[0.5em] uppercase">
              Nexus Pro &copy; 2026 / Wasted Inc.
          </p>
      </footer>
    </div>
  )
}

function StatItem({ value, label, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="space-y-1"
        >
            <h3 className="font-['Anton'] text-5xl md:text-6xl text-black drop-shadow-sm">{value}</h3>
            <p className="font-bold text-black uppercase tracking-widest text-sm">{label}</p>
        </motion.div>
    )
}

function OperationStep({ number, title, desc }) {
    return (
        <motion.div 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-4 group"
        >
            <span className="font-['Anton'] text-4xl text-zinc-700 group-hover:text-yellow-400 transition-colors">{number}</span>
            <div>
                <h4 className="font-['Anton'] text-2xl text-white uppercase mb-1">{title}</h4>
                <p className="text-zinc-400 max-w-sm">{desc}</p>
            </div>
        </motion.div>
    )
}

function CrewMember({ name, role, img }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden border-2 border-zinc-800 bg-black"
        >
            <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <img src={img} alt={name} className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="font-['Anton'] text-3xl text-white uppercase">{name}</h3>
                <p className="text-yellow-400 font-bold tracking-widest text-xs uppercase">{role}</p>
            </div>
        </motion.div>
    )
}

function ReviewCard({ name, role, quote, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-black/50 p-8 border border-white/10 backdrop-blur-sm relative group hover:bg-black/80 transition-colors"
        >
            <div className="absolute -top-4 -left-4 text-6xl text-yellow-400 font-serif opacity-20">"</div>
            <p className="text-lg text-zinc-300 italic mb-6 relative z-10">"{quote}"</p>
            <div>
                <h4 className="font-['Anton'] text-xl text-white uppercase">{name}</h4>
                <span className="text-xs text-yellow-500 font-bold tracking-widest uppercase">{role}</span>
            </div>
        </motion.div>
    )
}

// --- COMPONENTS ---

function IntroOverlay({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3000)
        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="h-20 w-20 mx-auto bg-white text-black flex items-center justify-center font-black text-4xl rounded-sm border-2 border-black mb-6">
                    N
                </div>
                <h1 className="font-['Anton'] text-4xl text-white tracking-widest uppercase mb-2">Nexus Pro</h1>
                <div className="w-64 h-2 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="h-full bg-yellow-400"
                    />
                </div>
                <p className="mt-4 text-zinc-500 font-mono text-xs uppercase animate-pulse">Initializing Heist Protocols...</p>
            </motion.div>
        </motion.div>
    )
}

function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener("mousemove", updateMousePosition)
        return () => window.removeEventListener("mousemove", updateMousePosition)
    }, [])

    return (
        <>
            <motion.div 
                className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-yellow-400 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
                animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
                transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
            />
            <motion.div 
                className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
                animate={{ x: mousePosition.x, y: mousePosition.y }}
                transition={{ type: "tween", ease: "linear", duration: 0 }}
            />
        </>
    )
}

function StatBar({ label, value, color }) {
    return (
        <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-white/70 uppercase">{label}</span>
            <div className="flex items-center gap-2">
                <div className="h-2 w-24 bg-zinc-700/50 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.5 }}
                        className={`h-full ${color}`} 
                    />
                </div>
                <span className="text-yellow-400">{value}</span>
            </div>
        </div>
    )
}

function FeatureCard({ img, title, desc, icon: Icon, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="relative group h-96 overflow-hidden border-4 border-white bg-black shadow-[10px_10px_0px_rgba(0,0,0,0.5)]"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-90" />
            <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
            
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 transform translate-y-4 transition-transform group-hover:translate-y-0">
                <Icon className="h-10 w-10 text-yellow-400 mb-2" />
                <h3 className="font-['Anton'] text-4xl text-white uppercase leading-none mb-2">{title}</h3>
                <p className="text-white/80 font-bold leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {desc}
                </p>
            </div>

            {/* Price Tag Sticker Effect */}
            <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-black font-black text-xs px-2 py-1 transform rotate-12 shadow-lg">
                NEW
            </div>
        </motion.div>
    )
}
