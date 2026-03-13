import { useState } from 'react';
import Search from './components/Search';
import Options from './components/Options';
import Checkout from './components/Checkout';
import Timer from './components/Timer';
import logo from './assets/logo.png';

function App() {
  const [step, setStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [travelDetails, setTravelDetails] = useState(null);

  const toggleOption = (id) => {
    setSelectedOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const calculateTotalBeforeDiscount = () => {
    const base = travelDetails ? travelDetails.basePrice : 0;
    const optsPrice = selectedOptions.reduce((acc, id) => {
      const prices = { 1:3, 2:2, 3:5, 4:1, 5:2.9 };
      return acc + (prices[id] || 0);
    }, 0);
    return base + optsPrice;
  };

  const handleValidateSearch = (details) => {
    setTravelDetails(details);
    setStep(2);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 relative bg-slate-100 pb-24">
      
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-blue-950 z-0 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-900/60 to-slate-100"></div>
      </div>

      <header className="relative z-10 p-6 flex justify-between items-center max-w-4xl mx-auto">
        <img src={logo} alt="TRAiN" className="h-28 sm:h-36 w-auto drop-shadow-lg object-contain" />
        <div className="hidden sm:flex gap-4 text-white/90 text-sm font-semibold">
          <span className="hover:text-orange-400 cursor-pointer transition-colors">Billets</span>
          <span className="hover:text-orange-400 cursor-pointer transition-colors">Abonnements</span>
          <span className="hover:text-orange-400 cursor-pointer transition-colors">Aide</span>
        </div>
      </header>
      
      <main className="relative z-10 max-w-3xl mx-auto px-4 mt-4 sm:mt-8">
        
        <div className="flex justify-center items-center gap-3 sm:gap-6 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-white" : "text-white/50"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-orange-500" : "bg-white/20"}`}>1</div>
            <span className="text-sm font-semibold hidden sm:block">Trajet</span>
          </div>
          <div className="w-10 h-0.5 bg-white/30 rounded"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-white" : "text-white/50"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-orange-500" : "bg-white/20"}`}>2</div>
            <span className="text-sm font-semibold hidden sm:block">Options</span>
          </div>
          <div className="w-10 h-0.5 bg-white/30 rounded"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? "text-white" : "text-white/50"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? "bg-orange-500" : "bg-white/20"}`}>3</div>
            <span className="text-sm font-semibold hidden sm:block">Paiement</span>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          {step === 1 && <Search onValidate={handleValidateSearch} />}
          {step === 2 && travelDetails && (
            <Options selectedOptions={selectedOptions} onToggle={toggleOption} nextStep={() => setStep(3)} prevStep={() => setStep(1)} basePrice={travelDetails.basePrice} />
          )}
          {step === 3 && travelDetails && (
            <Checkout totalBeforeDiscount={calculateTotalBeforeDiscount()} travelDetails={travelDetails} />
          )}
        </div>
      </main>

      <Timer />
    </div>
  );
}

export default App;