const OPTIONS = [
  { id: 1, label: "Place tranquille", price: 3 },      
  { id: 2, label: "Prise électrique", price: 2 },      
  { id: 3, label: "Bagage supplémentaire", price: 5 }, 
  { id: 4, label: "Info par SMS", price: 1 },           
  { id: 5, label: "Garantie Annulation", price: 2.9 }   
];

export default function Options({ selectedOptions, onToggle, onAddToCart, prevStep, basePrice }) {
  const totalOptions = selectedOptions.reduce((sum, id) => sum + OPTIONS.find(o => o.id === id).price, 0);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <h2 className="text-xl font-bold">2. Personnalisez votre voyage</h2>
      {OPTIONS.map(opt => (
        <div key={opt.id} className="flex justify-between items-center bg-white p-4 rounded border-l-4 border-blue-900 shadow-sm">
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{opt.label}</span>
            <span className="text-xs text-slate-500">+{opt.price}€</span>
          </div>
          <input 
            type="checkbox" 
            className="w-6 h-6 accent-orange-500 cursor-pointer"
            checked={selectedOptions.includes(opt.id)}
            onChange={() => onToggle(opt.id)}
          />
        </div>
      ))}
      <div className="bg-blue-900 text-white p-4 rounded-lg flex justify-between items-center font-bold shadow-lg">
        <span>Sous-total Billet :</span>
        <span className="text-xl">{(basePrice + totalOptions).toFixed(2)}€</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <button onClick={prevStep} className="border py-3 rounded hover:bg-slate-100 font-medium transition-colors">Retour</button>
        <button onClick={onAddToCart} className="bg-orange-500 text-white py-3 rounded font-bold shadow-md hover:bg-orange-600 transition-colors">Ajouter au Panier</button>
      </div>
    </div>
  );
}