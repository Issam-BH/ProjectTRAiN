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
  const [calendarAller, setCalendarAller] = useState(null);
  const [calendarRetour, setCalendarRetour] = useState(null);
  const [showCalAller, setShowCalAller] = useState(false);
  const [showCalRetour, setShowCalRetour] = useState(false);

  const fetchCalendar = async (isAller) => {
    const dep = isAller ? departure : arrival;
    const arr = isAller ? arrival : departure;
    if (!dep || !arr) return alert("Saisissez les gares.");
    let url = `/api/trajets/calendrier?gare_depart=${dep}&gare_arrivee=${arr}`;
    if (!isAller && dateAller) url += `&date_debut=${dateAller}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (isAller) { setCalendarAller(data); setShowCalAller(true); setShowCalRetour(false); }
      else { setCalendarRetour(data); setShowCalRetour(true); setShowCalAller(false); }
    } catch (e) { console.error(e); }
  };

  const handleSearch = async () => {
    if (dateRetour && dateRetour < dateAller) return alert("Le retour doit être après l'aller.");
    setShowCalAller(false); setShowCalRetour(false);
    if (!departure || !arrival || !dateAller) return alert("Champs manquants.");
    try {
      const resA = await fetch(`/api/trajets?gare_depart=${departure}&gare_arrivee=${arrival}&date=${dateAller}`);
      const dataA = await resA.json();
      setTrainsAller(dataA.map(t => ({ id: t._id, dep: t.heure_depart, arr: t.heure_arrive, price: t.tarifs.prix_aller_simple })));
      if (dateRetour) {
        const resR = await fetch(`/api/trajets?gare_depart=${arrival}&gare_arrivee=${departure}&date=${dateRetour}`);
        const dataR = await resR.json();
        setTrainsRetour(dataR.map(t => ({ id: t._id, dep: t.heure_depart, arr: t.heure_arrive, price: t.tarifs.prix_aller_simple })));
      } else { setTrainsRetour(null); }
    } catch (e) { console.error(e); }
  };

  const handleValidate = () => {
    onValidate({
      departure, arrival, dateAller, dateRetour,
      allerId: selectedAller.id,
      retourId: selectedRetour?.id,
      basePrice: selectedAller.price + (selectedRetour?.price || 0)
    });
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-black mb-8 text-blue-950">Quel est votre trajet ?</h2>
      <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-2 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-white p-4 rounded-xl border border-slate-100">
            <label className="text-[11px] font-black text-slate-400 uppercase">Départ</label>
            <input type="text" value={departure} onChange={e => setDeparture(e.target.value)} className="w-full text-lg font-bold outline-none" />
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100">
            <label className="text-[11px] font-black text-slate-400 uppercase">Arrivée</label>
            <input type="text" value={arrival} onChange={e => setArrival(e.target.value)} className="w-full text-lg font-bold outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="bg-white p-4 rounded-xl border border-slate-100 relative">
            <label className="text-[11px] font-black text-slate-400 uppercase">Aller</label>
            <input type="date" value={dateAller} onChange={e => setDateAller(e.target.value)} className="w-full font-bold outline-none" />
            <button onClick={() => fetchCalendar(true)} className="absolute right-2 bottom-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Prix Aller</button>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 relative">
            <label className="text-[11px] font-black text-slate-400 uppercase">Retour</label>
            <input type="date" min={dateAller} value={dateRetour} onChange={e => setDateRetour(e.target.value)} className="w-full font-bold outline-none" />
            <button onClick={() => fetchCalendar(false)} className="absolute right-2 bottom-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Prix Retour</button>
          </div>
        </div>
      </div>
      {!trainsAller ? (
        <button onClick={handleSearch} className="w-full bg-orange-500 text-white font-black py-5 rounded-2xl text-xl shadow-lg">Rechercher</button>
      ) : (
        <div className="mt-8 space-y-8">
          <div>
            <h3 className="font-bold mb-2">Aller : {departure} ➔ {arrival}</h3>
            {trainsAller.map(t => (
              <div key={t.id} onClick={() => setSelectedAller(t)} className={`p-4 border-2 mb-2 rounded-xl flex justify-between cursor-pointer ${selectedAller?.id === t.id ? 'border-orange-500 bg-orange-50' : 'bg-white'}`}>
                <span>{t.dep} ➔ {t.arr}</span><span className="font-black">{t.price}€</span>
              </div>
            ))}
          </div>
          {trainsRetour && (
            <div>
              <h3 className="font-bold mb-2">Retour : {arrival} ➔ {departure}</h3>
              {trainsRetour.map(t => (
                <div key={t.id} onClick={() => setSelectedRetour(t)} className={`p-4 border-2 mb-2 rounded-xl flex justify-between cursor-pointer ${selectedRetour?.id === t.id ? 'border-orange-500 bg-orange-50' : 'bg-white'}`}>
                  <span>{t.dep} ➔ {t.arr}</span><span className="font-black">{t.price}€</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-4">
            <button onClick={() => setTrainsAller(null)} className="w-1/3 bg-slate-200 py-4 rounded-xl font-bold">Modifier</button>
            <button onClick={handleValidate} disabled={!selectedAller || (trainsRetour && !selectedRetour)} className="w-2/3 bg-blue-950 text-white font-black py-4 rounded-xl disabled:opacity-50">Continuer</button>
          </div>
        </div>
      )}
      {(showCalAller || showCalRetour) && (
        <div className="mt-8 grid grid-cols-3 gap-2">
          {(showCalAller ? calendarAller : calendarRetour)?.slice(0, 9).map((j, i) => (
            <div key={i} onClick={() => { if(showCalAller) setDateAller(j.date); else setDateRetour(j.date); setShowCalAller(false); setShowCalRetour(false); }} className="border border-blue-200 bg-blue-50 p-3 rounded-xl text-center cursor-pointer">
              <p className="text-xs">{new Date(j.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
              <p className="font-black text-orange-600">{j.prix_minimum}€</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}