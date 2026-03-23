import { useState } from 'react';

const OPTIONS_LIST = [
  { id: 1, label: "Place tranquille", price: 3 },      
  { id: 2, label: "Prise électrique", price: 2 },      
  { id: 3, label: "Bagage supplémentaire", price: 5 }, 
  { id: 4, label: "Info par SMS", price: 1 },           
  { id: 5, label: "Garantie Annulation", price: 2.9 }   
];

export default function Options({ selectedOptions, onToggle, onAddToCart, prevStep, travelDetails }) {
  const [applyTo, setApplyTo] = useState('both'); 

  const handleAddToCart = async () => {
    try {
      const opts = selectedOptions.map(id => ({ 
        nom: OPTIONS_LIST.find(o => o.id === id).label 
      }));
      
      const hasRetour = travelDetails.retourId;

      await fetch('/api/panier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trajet: travelDetails.allerId,
          type: "aller",
          options: (applyTo === 'aller' || applyTo === 'both') ? opts : []
        })
      });

      if (hasRetour) {
        await fetch('/api/panier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trajet: travelDetails.retourId,
            type: "retour",
            options: (applyTo === 'retour' || applyTo === 'both') ? opts : []
          })
        });
      }
      onAddToCart();
    } catch (e) { console.error(e); }
  };

  const unitOptionsPrice = selectedOptions.reduce((sum, id) => sum + OPTIONS_LIST.find(o => o.id === id).price, 0);
  const multiplicateur = (travelDetails.retourId && applyTo === 'both') ? 2 : 1;
  const totalOptions = unitOptionsPrice * multiplicateur;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">2. Personnalisez votre voyage</h2>
      <div className="space-y-3">
        {OPTIONS_LIST.map(opt => (
          <div key={opt.id} className="flex justify-between items-center bg-white p-4 rounded border-l-4 border-blue-900 shadow-sm">
            <div className="flex flex-col">
              <span className="font-medium">{opt.label}</span>
              <span className="text-xs text-slate-500">+{opt.price}€</span>
            </div>
            <input type="checkbox" className="w-6 h-6 accent-orange-500" checked={selectedOptions.includes(opt.id)} onChange={() => onToggle(opt.id)} />
          </div>
        ))}
      </div>

      {travelDetails.retourId && selectedOptions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
          <p className="text-xs font-black text-blue-900 uppercase">Appliquer les options sur :</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input type="radio" name="applyTo" value="both" checked={applyTo === 'both'} onChange={e => setApplyTo(e.target.value)} /> Aller & Retour
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input type="radio" name="applyTo" value="aller" checked={applyTo === 'aller'} onChange={e => setApplyTo(e.target.value)} /> Aller uniquement
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input type="radio" name="applyTo" value="retour" checked={applyTo === 'retour'} onChange={e => setApplyTo(e.target.value)} /> Retour uniquement
            </label>
          </div>
        </div>
      )}

      <div className="bg-blue-900 text-white p-4 rounded-lg flex justify-between items-center font-bold">
        <span>TOTAL :</span>
        <span className="text-xl">{(travelDetails.basePrice + totalOptions).toFixed(2)}€</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={prevStep} className="border py-4 rounded font-bold">Retour</button>
        <button onClick={handleAddToCart} className="bg-orange-500 text-white py-4 rounded font-bold">Ajouter au Panier</button>
      </div>
    </div>
  );
}