import { useState } from 'react';

export default function Search({ onValidate }) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [dateAller, setDateAller] = useState('');
  const [dateRetour, setDateRetour] = useState('');

  const [trainsAller, setTrainsAller] = useState(null);
  const [trainsRetour, setTrainsRetour] = useState(null);
  const [selectedAller, setSelectedAller] = useState(null);
  const [selectedRetour, setSelectedRetour] = useState(null);

  const handleSearch = async () => {
    if (!departure || !arrival || !dateAller) {
      alert("Veuillez renseigner le départ, l'arrivée et la date d'aller.");
      return;
    }

    try {
      const res = await fetch(`/api/trajets?gare_depart=${departure}&gare_arrivee=${arrival}&date=${dateAller}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erreur lors de la recherche');

      const formattedTrains = data.map(t => ({
        id: t._id,
        dep: t.heure_depart,
        arr: t.heure_arrive,
        price: t.tarifs.prix_aller_simple
      }));

      setTrainsAller(formattedTrains);
      
      if (dateRetour) {
        const resRetour = await fetch(`/api/trajets?gare_depart=${arrival}&gare_arrivee=${departure}&date=${dateRetour}`);
        const dataRetour = await resRetour.json();
        setTrainsRetour(dataRetour.map(t => ({
          id: t._id,
          dep: t.heure_depart,
          arr: t.heure_arrive,
          price: t.tarifs.prix_aller_simple
        })));
      } else {
        setTrainsRetour(null);
      }
      
      setSelectedAller(null);
      setSelectedRetour(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la recherche des trajets.");
    }
  };

  const handleValidate = () => {
    const basePrice = selectedAller.price + (selectedRetour ? selectedRetour.price : 0);
    onValidate({
      departure,
      arrival,
      dateAller,
      dateRetour,
      timeAller: selectedAller.dep,
      timeRetour: selectedRetour?.dep,
      basePrice,
      allerId: selectedAller.id,
      retourId: selectedRetour?.id
    });
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-black mb-8 text-blue-950">Quel est votre trajet ?</h2>

      <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-2 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition-colors">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gare de départ</label>
            <input type="text" placeholder="Ex: Paris" value={departure} onChange={e => setDeparture(e.target.value)} className="w-full text-lg font-bold text-blue-950 bg-transparent border-none outline-none mt-1" />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition-colors">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gare d'arrivée</label>
            <input type="text" placeholder="Ex: Lyon" value={arrival} onChange={e => setArrival(e.target.value)} className="w-full text-lg font-bold text-blue-950 bg-transparent border-none outline-none mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition-colors">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Aller</label>
            <input type="date" value={dateAller} onChange={e => setDateAller(e.target.value)} className="w-full text-base font-bold text-slate-700 bg-transparent border-none outline-none mt-1 cursor-pointer" />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition-colors relative">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Retour</label>
            <input type="date" value={dateRetour} onChange={e => setDateRetour(e.target.value)} className="w-full text-base font-bold text-slate-700 bg-transparent border-none outline-none mt-1 cursor-pointer" />
          </div>
        </div>
      </div>

      {!trainsAller ? (
        <button onClick={handleSearch} className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-2xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all">
          Rechercher les billets
        </button>
      ) : (
        <div className="animate-fade-in-up mt-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-blue-950 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Trajets Aller : {departure} ➔ {arrival}
            </h3>
            <div className="grid gap-3">
              {trainsAller.map(train => (
                <div 
                  key={train.id}
                  onClick={() => setSelectedAller(train)}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex justify-between items-center transition-all ${selectedAller?.id === train.id ? 'border-orange-500 bg-orange-50' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                >
                  <div className="flex gap-4 items-center">
                    <div className="text-center">
                      <p className="text-lg font-black text-blue-950">{train.dep}</p>
                    </div>
                    <div className="w-12 h-0.5 bg-slate-300 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-slate-300 rotate-45"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-blue-950">{train.arr}</p>
                    </div>
                  </div>
                  <span className="font-black text-xl text-orange-600">{train.price}€</span>
                </div>
              ))}
            </div>
          </div>

          {trainsRetour && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-950 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Trajets Retour : {arrival} ➔ {departure}
              </h3>
              <div className="grid gap-3">
                {trainsRetour.map(train => (
                  <div 
                    key={train.id}
                    onClick={() => setSelectedRetour(train)}
                    className={`cursor-pointer border-2 rounded-xl p-4 flex justify-between items-center transition-all ${selectedRetour?.id === train.id ? 'border-orange-500 bg-orange-50' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="text-center">
                        <p className="text-lg font-black text-blue-950">{train.dep}</p>
                      </div>
                      <div className="w-12 h-0.5 bg-slate-300 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-slate-300 rotate-45"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-blue-950">{train.arr}</p>
                      </div>
                    </div>
                    <span className="font-black text-xl text-orange-600">{train.price}€</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleValidate}
            disabled={!selectedAller || (trainsRetour && !selectedRetour)}
            className="w-full bg-blue-950 text-white font-black text-lg py-4 rounded-xl mt-4 shadow-lg hover:bg-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuer
          </button>
        </div>
      )}
    </div>
  );
}