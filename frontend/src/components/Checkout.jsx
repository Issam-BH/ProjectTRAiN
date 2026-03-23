import { useState, useEffect } from 'react';

export default function Checkout({ onPaymentSuccess, onCartUpdate }) {
  const [recap, setRecap] = useState(null);
  const [isAbonne, setIsAbonne] = useState(false);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', cb: '', date_expiration: '', cvv: ''
  });

  useEffect(() => {
    // On va chercher le récapitulatif exact généré par le Backend
    const fetchRecap = async () => {
      try {
        const res = await fetch('/api/panier/recapitulatif');
        const data = await res.json();
        setRecap(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRecap();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const finalTotal = isAbonne && recap ? recap.prixTotal - 10 : recap?.prixTotal;

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/paiement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(`Paiement validé ! Référence : ${data.reference}\nUn email vous a été envoyé avec vos billets.`);
        onCartUpdate();     // Met à jour la petite pastille du panier en haut à droite
        onPaymentSuccess(); // Retourne à l'accueil
      } else {
        alert(`Erreur lors du paiement : ${data.message}`);
      }
    } catch(err) {
      alert("Erreur de communication avec le serveur.");
    }
  };

  if (!recap) return <div className="text-center p-10 font-bold text-blue-900 animate-pulse">Chargement de votre panier sécurisé...</div>;

  return (
    <form onSubmit={handlePay} className="bg-white p-6 rounded-xl shadow-md space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold border-b pb-2">3. Récapitulatif & Paiement</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="mb-4 space-y-3">
          {recap.articles.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b border-blue-200/50 pb-2 last:border-0">
              <div>
                <p className="font-bold text-blue-900 text-sm">
                  Billet {index + 1} : {item.trajet.gare_depart} ➔ {item.trajet.gare_arrivee}
                </p>
                <p className="text-xs text-slate-500">
                  Le {new Date(item.trajet.date).toLocaleDateString()} - Options: {item.options.length}
                </p>
              </div>
              <span className="font-bold text-blue-900">{item.sousTotal.toFixed(2)}€</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-blue-200">
          <span className="font-bold text-blue-900">Total à payer</span>
          <span className="font-black text-orange-600 text-2xl">{finalTotal?.toFixed(2)}€</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="font-bold text-sm text-slate-700">Vos informations :</p>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" name="prenom" onChange={handleChange} placeholder="Prénom" className="border p-2 rounded w-full" required /> 
          <input type="text" name="nom" onChange={handleChange} placeholder="Nom" className="border p-2 rounded w-full" required /> 
        </div>
        
        <div className="bg-orange-50 p-4 rounded border border-orange-200 mt-2">
          <label className="text-sm font-bold text-orange-800 flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={isAbonne} onChange={(e) => setIsAbonne(e.target.checked)} />
            J'ai une carte d'abonnement (-10€) 
          </label>
        </div>

        <hr />
        <p className="font-bold text-sm text-slate-700 italic">Paiement par Carte Bancaire :</p>
        <input type="text" name="cb" onChange={handleChange} placeholder="N° de carte (ex: 1234123412341234)" minLength="16" maxLength="16" className="border p-2 rounded w-full" required /> 
        <div className="flex gap-2">
          <input type="text" name="date_expiration" onChange={handleChange} placeholder="Date d'exp (MM/YY)" className="border p-2 rounded flex-1" required /> 
          <input type="text" name="cvv" onChange={handleChange} placeholder="CVV (3 chiffres)" minLength="3" maxLength="3" className="border p-2 rounded flex-1" required /> 
        </div>
      </div>
      
      <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-green-700 mt-4 uppercase transition-colors">
        Payer {finalTotal?.toFixed(2)}€
      </button>
    </form>
  );
}