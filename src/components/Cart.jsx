import { useState } from 'react';

export default function Cart({ isOpen, onClose, travelDetails, selectedOptions, onRemoveOption, onCheckout }) {
  const OPTIONS = [
    { id: 1, label: "Place tranquille", price: 3 },      
    { id: 2, label: "Prise électrique", price: 2 },      
    { id: 3, label: "Bagage supplémentaire", price: 5 }, 
    { id: 4, label: "Info par SMS", price: 1 },           
    { id: 5, label: "Garantie Annulation", price: 2.9 }   
  ];

  if (!isOpen) return null;

  const basePrice = travelDetails ? travelDetails.basePrice : 0;
  
  const selectedOptionsDetails = selectedOptions.map(id => OPTIONS.find(o => o.id === id)).filter(Boolean);
  
  const optionsTotal = selectedOptionsDetails.reduce((acc, opt) => acc + opt.price, 0);
  
  const total = basePrice + optionsTotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-slate-50 h-full shadow-2xl flex flex-col animate-fade-in-up sm:animate-none">
        <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-blue-950 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Mon Panier
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!travelDetails ? (
            <div className="text-center text-slate-500 mt-10">
              <p>Votre panier est vide.</p>
              <p className="text-sm mt-2">Veuillez d'abord sélectionner un trajet.</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Billets</span>
                  <span className="font-black text-blue-950 text-lg">{basePrice.toFixed(2)}€</span>
                </div>
                <p className="font-bold text-blue-900">{travelDetails.departure} ➔ {travelDetails.arrival}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Aller : {new Date(travelDetails.dateAller).toLocaleDateString()}
                  {travelDetails.dateRetour && ` | Retour : ${new Date(travelDetails.dateRetour).toLocaleDateString()}`}
                </p>
              </div>

              {selectedOptionsDetails.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Options ajoutées</h3>
                  {selectedOptionsDetails.map(opt => (
                    <div key={opt.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{opt.label}</p>
                        <p className="text-xs text-slate-500">+{opt.price.toFixed(2)}€</p>
                      </div>
                      <button 
                        onClick={() => onRemoveOption(opt.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Retirer cet article"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-white p-6 border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-slate-500 font-bold">Total TTC</span>
            <span className="text-3xl font-black text-blue-950">{total.toFixed(2)}€</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onClose}
              className="bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={onCheckout}
              disabled={!travelDetails}
              className="bg-orange-500 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}