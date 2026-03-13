export default function Cart({ isOpen, onClose, cart, onRemoveItem, onCheckout }) {
  const OPTIONS = [
    { id: 1, label: "Place tranquille", price: 3 },      
    { id: 2, label: "Prise électrique", price: 2 },      
    { id: 3, label: "Bagage supplémentaire", price: 5 }, 
    { id: 4, label: "Info par SMS", price: 1 },           
    { id: 5, label: "Garantie Annulation", price: 2.9 }   
  ];

  if (!isOpen) return null;

  const calculateItemTotal = (item) => {
    const optionsPrice = item.selectedOptions.reduce((acc, id) => {
      const opt = OPTIONS.find(o => o.id === id);
      return acc + (opt ? opt.price : 0);
    }, 0);
    return item.travelDetails.basePrice + optionsPrice;
  };

  const total = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);

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
            Mon Panier ({cart.length})
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">
              <p>Votre panier est vide.</p>
              <p className="text-sm mt-2">Veuillez d'abord sélectionner un trajet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative">
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                  
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Billet {index + 1}</h3>
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <p className="font-bold text-blue-900">{item.travelDetails.departure} ➔ {item.travelDetails.arrival}</p>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">
                    Aller : {new Date(item.travelDetails.dateAller).toLocaleDateString()}
                    {item.travelDetails.dateRetour && ` | Retour : ${new Date(item.travelDetails.dateRetour).toLocaleDateString()}`}
                  </p>

                  {item.selectedOptions.length > 0 && (
                    <div className="space-y-1 mb-4">
                      {item.selectedOptions.map(optId => {
                        const option = OPTIONS.find(o => o.id === optId);
                        return (
                          <div key={optId} className="flex justify-between text-xs text-slate-500">
                            <span>+ {option?.label}</span>
                            <span>{option?.price.toFixed(2)}€</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400">Sous-total</span>
                    <span className="font-black text-blue-950 text-lg">{calculateItemTotal(item).toFixed(2)}€</span>
                  </div>
                </div>
              ))}
            </div>
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
              Ajouter un billet
            </button>
            <button 
              onClick={onCheckout}
              disabled={cart.length === 0}
              className="bg-orange-500 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Payer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}