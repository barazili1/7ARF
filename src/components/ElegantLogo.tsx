import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface ElegantLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ElegantLogo = ({ className, size = 'md' }: ElegantLogoProps) => {
  const sizeMap = {
    sm: 'w-14 h-14 rounded-2xl border-white/10',
    md: 'w-20 h-20 rounded-[24px] border-white/20',
    lg: 'w-28 h-28 rounded-[32px] border-white/25',
    xl: 'w-36 h-36 rounded-[40px] border-white/30',
  };

  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      {/* Outer Red Halo Rings rotating */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-6 rounded-full border border-dashed border-red-400/30"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-3 rounded-full border border-t-[rgb(239,68,68)]/45 border-r-transparent border-b-[rgb(239,68,68)]/15 border-l-transparent"
      />

      {/* Embedded sparkles element */}
      <div className="absolute -top-3 -right-3">
        <Sparkles className="w-5 h-5 text-red-400 animate-bounce" />
      </div>

      <motion.div
        animate={{ 
          y: [0, -5, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="relative z-10"
      >
        <div className={cn(
          "overflow-hidden border shadow-[0_15px_40px_rgba(239,68,68,0.35)] bg-gradient-to-b from-black to-[#1a0104] transition-all duration-300", 
          sizeMap[size]
        )}>
          <img 
            src="https://cdn.phototourl.com/free/2026-07-15-a2a63f5c-b4ab-4b89-b5ed-5242b62520e3.jpg" 
            alt="7ARFOUSH VIP Logo" 
            className="w-full h-full object-cover select-none pointer-events-none hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      {/* Floating neon glow reflection */}
      <div className="absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.25)_0%,transparent_70%)] blur-2xl pointer-events-none" />
    </div>
  );
};
