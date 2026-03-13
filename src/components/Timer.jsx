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
    <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-sm text-slate-100 px-5 py-3 rounded-2xl font-mono shadow-2xl z-50 flex items-center gap-3 border border-slate-700/50 transition-all hover:scale-105">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
      </div>
      <span className="text-sm font-medium tracking-wide">Session : {format(seconds)}</span>
    </div>
  );
}