import { useState, useEffect } from 'react';
import Search from './components/Search';
import Options from './components/Options';
import Checkout from './components/Checkout';
import Timer from './components/Timer';
import MyTickets from './components/MyTickets';
import Cart from './components/Cart';
import Login from './components/Login';
import logo from './assets/logo.png';

function App() {
  const [view, setView] = useState('booking');
  const [step, setStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [travelDetails, setTravelDetails] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleOption = (id) => {
    setSelectedOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleValidateSearch = (details) => {
    setTravelDetails(details);
    setStep(2);
  };

  const addToCart = () => {
    fetchCartCount();
    setTravelDetails(null);
    setSelectedOptions([]);
    setStep(1);
    setIsCartOpen(true);
  };

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/panier/recapitulatif');
      const data = await res.json();
      if (data && data.nombreArticles !== undefined) {
        setCartCount(data.nombreArticles);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const goHome = () => {
    setView('booking');
    setStep(1);
    setTravelDetails(null);
    setSelectedOptions([]);
  };

  const handleCartCheckout = () => {
    setIsCartOpen(false);
    setView('booking');
    setStep(3);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 relative bg-slate-100 pb-24">
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-blue-950 z-0 bg-[url('https://www.madame-oreille.com/wp-content/uploads/2021/06/train-sri-sunset.jpg?')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-900/60 to-slate-100"></div>
      </div>

      <header className="relative z-10 p-6 flex justify-between items-center max-w-4xl mx-auto">
        <img 
          src={logo} 
          alt="TRAiN" 
          className="h-28 sm:h-36 w-auto drop-shadow-lg object-contain cursor-pointer" 
          onClick={goHome}
        />
        <div className="flex items-center gap-6 text-white/90 text-sm font-semibold">
          <span 
            className="hover:text-orange-400 cursor-pointer transition-colors hidden sm:block"
            onClick={() => setView('tickets')}
          >
            Mes Billets
          </span>
          <span 
            className="hover:text-orange-400 cursor-pointer transition-colors hidden sm:block"
            onClick={() => setView('login')}
          >
            Connexion
          </span>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-colors border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-950">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <main className="relative z-10 max-w-3xl mx-auto px-4 mt-4 sm:mt-8">
        {view === 'booking' && (
          <>
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
                <Options 
                  selectedOptions={selectedOptions} 
                  onToggle={toggleOption} 
                  onAddToCart={addToCart} 
                  prevStep={() => setStep(1)} 
                  travelDetails={travelDetails} 
                />
              )}
              {step === 3 && (
                <Checkout onPaymentSuccess={goHome} onCartUpdate={fetchCartCount} />
              )}
            </div>
          </>
        )}

        {view === 'tickets' && <MyTickets onBack={goHome} />}
        {view === 'login' && <Login onBack={goHome} />}
      </main>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={handleCartCheckout}
        onCartUpdate={fetchCartCount}
      />
      <Timer />
    </div>
  );
}

export default App;