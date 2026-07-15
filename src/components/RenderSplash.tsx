import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Diamond, Sparkles, Fingerprint, RefreshCw } from 'lucide-react';

interface RenderSplashProps {
  onComplete: () => void;
}

export const RenderSplash = ({ onComplete }: RenderSplashProps) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("جاري تفعيل الاتصال الآمن...");

  const statuses = [
    "جاري تحميل خوارزمية التشفير...",
    "جاري فحص اتصال الخادم الخاص...",
    "جاري مزامنة مصفوفة التنبؤ...",
    "التحقق من ترخيص VIP النشط...",
    "أكتمل الاتصال بنجاح. مرحباً بك!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + jump);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) setStatusText(statuses[0]);
    else if (progress < 50) setStatusText(statuses[1]);
    else if (progress < 75) setStatusText(statuses[2]);
    else if (progress < 95) setStatusText(statuses[3]);
    else setStatusText(statuses[4]);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-transparent relative overflow-hidden font-sans select-none" id="luxury-splash">
      
      {/* Background radial highlight (warm red / crimson) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-red-500/10 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      {/* Decorative ambient glowing grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 z-0 pointer-events-none" />
 
      {/* Floating Red Embers Particles (animated using framer motion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-red-400/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
 
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-12"
      >
        {/* Luxury Logo Container */}
        <div className="relative">
          {/* Rotating outer delicate rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-n-4 -inset-4 rounded-full border border-red-500/10 pointer-events-none"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-dashed border-white/5 pointer-events-none"
          />
          
          <motion.div
            animate={{ scale: [1, 1.03, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-1 bg-red-500/15 rounded-full blur-2xl"
          />
 
          {/* Core Gem/Hexagon Emblem */}
          <div className="relative w-24 h-24 bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-red-500/30 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Shimmer light effect */}
            <motion.div 
              animate={{ x: [-150, 150] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/[0.05] to-transparent skew-x-12 z-10 pointer-events-none"
            />
            <img 
              src="https://cdn.phototourl.com/free/2026-07-15-a2a63f5c-b4ab-4b89-b5ed-5242b62520e3.jpg" 
              alt="7ARFOUSH VIP Logo" 
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
 
        {/* Brand/Heading block */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, tracking: "0.1em" }}
            animate={{ opacity: 1, tracking: "0.25em" }}
            transition={{ duration: 1.5, delay: 0.1 }}
            className="flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-red-400 animate-spin-slow shrink-0" />
            <h1 className="text-3xl font-light text-white tracking-[0.1em] font-sans">
              7ARFOUSH <span className="text-red-400 font-bold">VIP</span>
            </h1>
            <Sparkles className="w-4 h-4 text-red-400 animate-spin-slow shrink-0" />
          </motion.div>
          
          <div className="flex justify-center items-center gap-3">
            <span className="h-[1px] w-12 bg-linear-to-r from-transparent to-red-500/35" />
            <p className="text-[10px] uppercase font-mono tracking-[0.3em] text-red-500/60 font-semibold">PREMIUM DECRYPTER</p>
            <span className="h-[1px] w-12 bg-linear-to-l from-transparent to-red-500/35" />
          </div>
        </div>
 
        {/* Beautiful Glass Status Dashboard */}
        <div className="w-full bg-[#0a0a0a]/80 border border-white/5 rounded-3xl p-6 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-3xl relative">
          {/* Glow border header accent */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          
          {/* Progress indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-red-400/80 animate-spin" />
              <span className="text-xs text-white/80 font-medium Arabic-support">
                {statusText}
              </span>
            </div>
            <span className="text-sm font-bold text-red-400 font-mono tracking-wide">
              {progress}%
            </span>
          </div>
 
          {/* Minimal Ultra-Thin Loader Line */}
          <div className="w-full h-[3px] bg-white/[0.03] rounded-full overflow-hidden relative">
            <div 
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-300 rounded-full transition-all duration-200 ease-out relative"
            >
              {/* Pulsing glow point at the front of the loader */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-300 blur-[2px]" />
            </div>
          </div>
 
          {/* Bottom Security Info Footer */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span className="flex items-center gap-1.5 uppercase">
              <Fingerprint className="w-3 h-3 text-red-400/60" /> SYSTEM SECURE
            </span>
            <span className="tracking-widest text-[9px] uppercase">
              VERSION 2.1
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
