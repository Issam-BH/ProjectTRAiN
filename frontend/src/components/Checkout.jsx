import { useState, useEffect } from 'react';

export default function Checkout({ onPaymentSuccess, onCartUpdate }) {
  const [recap, setRecap] = useState(null);
  const [codePromo, setCodePromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [formData, setFormData] = useState({ nom: '', prenom: '', cb: '', date_expiration: '', cvv: '' });

  useEffect(() => {
    fetch('/api/panier/recapitulatif').then(r => r.json()).then(setRecap);
  }, []);

  const applyPromo = () => {
    if (codePromo.toUpperCase() === 'FIDELITE10') {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/paiement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      onCartUpdate();
      onPaymentSuccess();
    }
  };

  if (!recap) return null;

  return (
    <form onSubmit={handlePay} className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold border-b pb-2">3. Récapitulatif & Paiement</h2>
      <div className="bg-blue-50 p-4 rounded-lg">
        {recap.articles.map((item, i) => (
          <div key={i} className="flex justify-between text-sm border-b py-2 last:border-0">
            <div>
              <p className="font-bold">{item.trajet.gare_depart} ➔ {item.trajet.gare_arrivee}</p>
              <p className="text-xs text-slate-500">{item.type}</p>
            </div>
            <span className="font-bold">{item.sousTotal.toFixed(2)}€</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 pt-2 border-t-2 border-blue-200">
          <span className="font-bold text-blue-900">Total à payer</span>
          <span className="font-black text-orange-600 text-2xl">{Math.max(0, recap.prixTotal - discount).toFixed(2)}€</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Prénom" onChange={e => setFormData({...formData, prenom: e.target.value})} className="border p-2 rounded" required />
        <input type="text" placeholder="Nom" onChange={e => setFormData({...formData, nom: e.target.value})} className="border p-2 rounded" required />
      </div>

      <div className="bg-orange-50 p-4 rounded border border-orange-200 flex gap-2">
        <input type="text" placeholder="Code FIDELITE10" value={codePromo} onChange={e => setCodePromo(e.target.value)} className="border border-orange-200 p-2 rounded flex-1 text-sm" />
        <button type="button" onClick={applyPromo} className="bg-orange-500 text-white px-4 rounded font-bold text-sm">Appliquer</button>
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-sm font-bold italic">Informations de paiement :</p>
        <input type="text" placeholder="N° de carte" minLength="16" maxLength="16" onChange={e => setFormData({...formData, cb: e.target.value})} className="border p-2 rounded w-full" required />
        <div className="flex gap-2">
          <input type="text" placeholder="MM/YY" onChange={e => setFormData({...formData, date_expiration: e.target.value})} className="border p-2 rounded flex-1" required />
          <input type="text" placeholder="CVV" minLength="3" maxLength="3" onChange={e => setFormData({...formData, cvv: e.target.value})} className="border p-2 rounded flex-1" required />
        </div>
      </div>

      <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-green-700 transition-colors uppercase">
        Confirmer le paiement
      </button>
    </form>
  );
}