import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';

export function MouseSimulation() {
  const {
    mousePosition,
    isClicking,
    isTyping,
    isScrolling,
    setMousePosition,
    automationStatus,
  } = useBrowserAutomationStore();

  const containerRef = useRef<HTMLDivElement>(null);

  // Animate the mouse position periodically during automation
  useEffect(() => {
    if (automationStatus !== 'running') return;

    const targets = [
      { x: 45, y: 30 }, { x: 60, y: 55 }, { x: 30, y: 70 },
      { x: 75, y: 40 }, { x: 50, y: 80 }, { x: 20, y: 50 },
      { x: 65, y: 20 }, { x: 40, y: 60 },
    ];
    let idx = 0;

    const interval = setInterval(() => {
      setMousePosition(targets[idx % targets.length]);
      idx++;
    }, 1200);

    return () => clearInterval(interval);
  }, [automationStatus, setMousePosition]);

  const cursorX = `${mousePosition.x}%`;
  const cursorY = `${mousePosition.y}%`;

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="text-base">🖱️</span> Mouse Simulation
        </h3>
        <div className="flex items-center gap-2">
          {isClicking && (
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full animate-pulse">CLICK</span>
          )}
          {isTyping && (
            <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-1 rounded-full animate-pulse">TYPING</span>
          )}
          {isScrolling && (
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full animate-pulse">SCROLL</span>
          )}
        </div>
      </div>

      {/* Simulation area */}
      <div
        ref={containerRef}
        className="relative h-[180px] bg-slate-950/50 rounded-xl border border-white/5 overflow-hidden"
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Mock UI elements */}
        <div className="absolute inset-4 flex flex-col gap-2 pointer-events-none opacity-30">
          <div className="h-6 bg-white/10 rounded-lg w-3/4" />
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-5/6" />
          <div className="h-8 bg-blue-500/20 rounded-lg w-1/3 mt-2" />
        </div>

        {/* Animated cursor */}
        <motion.div
          animate={{ left: cursorX, top: cursorY }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="absolute z-10 pointer-events-none"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {/* Cursor SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5" className="drop-shadow-lg">
            <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
          </svg>

          {/* Click ripple */}
          <AnimatePresence>
            {isClicking && (
              <>
                <motion.div
                  key="click-inner"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{}}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 -translate-x-1/4 -translate-y-1/4 h-6 w-6 rounded-full bg-blue-400/60"
                />
                <motion.div
                  key="click-outer"
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{}}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="absolute inset-0 -translate-x-1/4 -translate-y-1/4 h-6 w-6 rounded-full bg-blue-400/30"
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scroll indicator */}
        <AnimatePresence>
          {isScrolling && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-3 bottom-3 w-1.5 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                animate={{ y: ['0%', '70%', '0%'] }}
                transition={{ duration: 0.8, repeat: 2 }}
                className="h-1/3 w-full bg-blue-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing animation */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 left-4 right-4 flex items-center gap-1 bg-slate-800/90 rounded-lg px-3 py-2 border border-white/10"
            >
              <div className="flex-1 text-[10px] font-mono text-slate-200">
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  Senior React Developer San Francisco...
                </motion.span>
              </div>
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="h-3 w-0.5 bg-blue-400"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coordinates */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>X: {mousePosition.x.toFixed(0)}%</span>
        <span>Y: {mousePosition.y.toFixed(0)}%</span>
        <span className={`font-bold ${automationStatus === 'running' ? 'text-emerald-400' : 'text-slate-500'}`}>
          {automationStatus === 'running' ? '● ACTIVE' : '○ IDLE'}
        </span>
      </div>
    </div>
  );
}
