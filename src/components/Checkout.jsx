import { useState } from 'react';

export default function Checkout({ totalBeforeDiscount, travelDetails }) {
  const [isAbonne, setIsAbonne] = useState(false);
  const finalTotal = isAbonne ? totalBeforeDiscount - 10 : totalBeforeDiscount;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold border-b pb-2">3. Récapitulatif & Paiement</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
        <div>
          <p className="font-bold text-blue-900">
            {travelDetails.departure.toUpperCase()} ➔ {travelDetails.arrival.toUpperCase()}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Aller : {new Date(travelDetails.dateAller).toLocaleDateString()} à {travelDetails.timeAller}
            {travelDetails.dateRetour && ` | Retour : ${new Date(travelDetails.dateRetour).toLocaleDateString()} à ${travelDetails.timeRetour}`}
          </p>
        </div>
        <span className="font-black text-blue-900 text-2xl">{finalTotal.toFixed(2)}€</span>
      </div>
      
      <div className="space-y-4">
        <p className="font-bold text-sm text-slate-700">Vos informations :</p>
        <div className="grid grid-cols-3 gap-2">
          <select className="border p-2 rounded col-span-1"> 
            <option>M.</option>
            <option>Mme</option>
          </select>
          <input type="text" placeholder="Nom" className="border p-2 rounded col-span-2" required /> 
        </div>
        <input type="text" placeholder="Prénom" className="border p-2 rounded w-full" required /> 
        <input type="tel" placeholder="Tél mobile" className="border p-2 rounded w-full" required /> 
        <input type="email" placeholder="E-mail" className="border p-2 rounded w-full" required /> 
        
        <div className="bg-orange-50 p-4 rounded border border-orange-200">
          <label className="text-sm font-bold text-orange-800 flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={isAbonne} onChange={(e) => setIsAbonne(e.target.checked)} />
            J'ai une carte d'abonnement (-10€) 
          </label>
          {isAbonne && (
            <input type="text" placeholder="Code promotion ou N° de carte" className="border p-2 rounded w-full text-sm mt-2" /> 
          )}
        </div>

        <hr />
        <p className="font-bold text-sm text-slate-700 italic">Paiement par Carte Bancaire :</p>
        <input type="text" placeholder="Nom du titulaire de la CB" className="border p-2 rounded w-full" required /> 
        <input type="text" placeholder="N° de carte (16 chiffres)" className="border p-2 rounded w-full" required /> 
        <div className="flex gap-2">
          <input type="text" placeholder="Date d'exp (MM/YY)" className="border p-2 rounded flex-1" required /> 
          <input type="text" placeholder="Trigramme (CVV)" className="border p-2 rounded flex-1" required /> 
        </div>
      </div>
      
      <button className="w-full bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-green-700 mt-4 uppercase transition-colors" onClick={() => alert("Paiement validé ! Impression des billets...")}>
        Payer {finalTotal.toFixed(2)}€
      </button>
    </div>
  );
}