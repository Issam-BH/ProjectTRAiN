import { useState } from 'react';

export default function Login({ onBack, onSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoginView) {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: email, password: password }) 
        });

        const data = await res.json();

        if (res.ok) {
          alert(`Connexion réussie ! Bienvenue ${data.user.prenom}`);
          if (onSuccess) onSuccess(); // Retour intelligent selon le contexte
          else onBack();
        } else {
          alert(`Erreur : ${data.message}`);
        }
      } catch (error) {
        console.error(error);
        alert("Erreur de connexion au serveur.");
      }
    } else {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            login: email, 
            password: password,
            nom: nom,
            prenom: prenom
          }) 
        });

        const data = await res.json();

        if (res.ok) {
          alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
          setIsLoginView(true);
        } else {
          alert(`Erreur : ${data.message}`);
        }
      } catch (error) {
        console.error(error);
        alert("Erreur de connexion au serveur.");
      }
    }
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-fade-in-up max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-950">
          {isLoginView ? "Espace Abonné" : "Créer un compte"}
        </h2>
        <button onClick={onBack} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
          ← Retour
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {!isLoginView && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nom</label>
              <input type="text" required={!isLoginView} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Dupont" className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-xl mt-1 text-slate-800 font-medium focus:border-orange-500 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Prénom</label>
              <input type="text" required={!isLoginView} value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Jean" className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-xl mt-1 text-slate-800 font-medium focus:border-orange-500 outline-none transition-colors" />
            </div>
          </div>
        )}

        <div>
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Login / Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-xl mt-1 text-slate-800 font-medium focus:border-orange-500 outline-none transition-colors" />
        </div>

        <div>
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-xl mt-1 text-slate-800 font-medium focus:border-orange-500 outline-none transition-colors" />
        </div>

        <button type="submit" className="w-full bg-blue-950 text-white font-black text-lg py-4 rounded-xl mt-4 shadow-lg hover:bg-blue-900 transition-all hover:-translate-y-0.5">
          {isLoginView ? "Se connecter" : "S'inscrire"}
        </button>

        <div className="text-center pt-4 border-t border-slate-100 mt-6">
          <p className="text-sm text-slate-500 mb-2">
            {isLoginView ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
          </p>
          <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
            {isLoginView ? "Créer un compte" : "Se connecter"}
          </button>
        </div>
      </form>
    </div>
  );
}