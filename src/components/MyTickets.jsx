import { useState } from 'react';

export default function MyTickets({ onBack }) {
  const [tickets] = useState([
    {
      id: 'TR-9823',
      departure: 'Paris Gare de Lyon',
      arrival: 'Lyon Part-Dieu',
      date: '07/01/2021',
      time: '08:00',
      passengers: 'M. Jean Dupont',
      price: 45
    },
    {
      id: 'TR-9824',
      departure: 'Lyon Part-Dieu',
      arrival: 'Paris Gare de Lyon',
      date: '15/01/2021',
      time: '10:00',
      passengers: 'M. Jean Dupont',
      price: 49
    }
  ]);

  const handleReprint = (id) => {
    alert(`Impression du billet ${id} en cours...`);
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-950">Mes Billets</h2>
        <button onClick={onBack} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
          ← Retour à l'accueil
        </button>
      </div>

      <div className="space-y-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="border-2 border-slate-100 rounded-2xl p-5 hover:border-blue-200 transition-colors flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Réf: {ticket.id}</span>
                <span className="text-sm font-black text-blue-950">{ticket.price}€</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-black text-blue-950">{ticket.departure}</span>
                <div className="flex-1 h-0.5 bg-slate-200 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-slate-300 rotate-45"></div>
                </div>
                <span className="text-lg font-black text-blue-950">{ticket.arrival}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                Le {ticket.date} à {ticket.time}
              </p>
              <p className="text-xs text-slate-500 mt-1">Passager : {ticket.passengers}</p>
            </div>
            
            <button 
              onClick={() => handleReprint(ticket.id)}
              className="w-full sm:w-auto bg-blue-950 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-900 transition-all shadow-md hover:-translate-y-0.5"
            >
              Réimprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}