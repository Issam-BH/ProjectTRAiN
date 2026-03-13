import { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(180); 

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => setSeconds(s => s - 1), 1000);
      return () => clearInterval(timer);
    } else {
      alert("Temps écoulé (3 mn) : La session a expiré !"); 
    }
  }, [seconds]);

  const format = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800/40 backdrop-blur-md text-white/90 px-3 py-2 rounded-xl text-xs font-mono shadow-sm z-50 flex items-center gap-2 border border-slate-700/30 transition-all hover:bg-slate-800/60">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </div>
      <span>Session : {format(seconds)}</span>
    </div>
  );
}