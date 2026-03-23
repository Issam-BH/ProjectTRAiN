import { useState, useEffect } from 'react';

export default function MyTickets({ onBack }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) {
          throw new Error('Non autorisé');
        }
        const user = await res.json();
        setTickets(user.billets);
      } catch (err) {
        setError('Vous devez vous connecter pour voir vos billets.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  const handleDownloadPDF = (identifiant) => {
    // Cela ouvrira la route de téléchargement et forcera l'enregistrement du PDF
    window.open(`/api/billets/${identifiant}/pdf`, '_blank');
  };

  if (loading) return <div className="p-10 text-center font-bold text-blue-900">Chargement de vos billets...</div>;

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-950">Mes Billets</h2>
        <button onClick={onBack} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
          ← Retour à l'accueil
        </button>
      </div>

      {error ? (
        <div className="text-center p-8 bg-orange-50 border border-orange-200 text-orange-600 rounded-xl font-bold">
          {error}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center p-8 bg-slate-50 text-slate-500 rounded-xl">
          Vous n'avez aucun billet pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, i) => (
            <div key={ticket.identifiant || i} className="border-2 border-slate-100 rounded-2xl p-5 hover:border-blue-200 transition-colors flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Réf: {ticket.identifiant}</span>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-black text-blue-950">Trajet ID: {ticket.reservation.trajet.slice(-6).toUpperCase()}</span>
                </div>
                <p className="text-sm text-slate-600 font-medium">Type : {ticket.reservation.type}</p>
              </div>
              
              <button 
                onClick={() => handleDownloadPDF(ticket.identifiant)}
                className="w-full sm:w-auto bg-blue-950 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-900 transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}