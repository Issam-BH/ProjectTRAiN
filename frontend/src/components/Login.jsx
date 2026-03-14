import { useState } from 'react';

export default function Login({ onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Connexion réussie !");
    onBack();
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-fade-in-up max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-950">Espace Abonné</h2>
        <button onClick={onBack} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
          ← Retour
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Login / Email</label>
          <input 
            type="text" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="votre@email.com" 
            className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-xl mt-1 text-slate-800 font-medium focus:border-orange-500 outline-none transition-colors" 
          />
        </div>

        <div>
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-xl mt-1 text-slate-800 font-medium focus:border-orange-500 outline-none transition-colors" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-950 text-white font-black text-lg py-4 rounded-xl mt-4 shadow-lg hover:bg-blue-900 transition-all hover:-translate-y-0.5"
        >
          Se connecter
        </button>

        <div className="text-center pt-4">
          <span className="text-sm font-medium text-slate-500 hover:text-orange-500 cursor-pointer transition-colors">
            Mot de passe oublié ?
          </span>
        </div>
      </form>
    </div>
  );
}