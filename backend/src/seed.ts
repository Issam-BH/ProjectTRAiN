import mongoose from 'mongoose'
import { MONGODB_URI } from './config.js'
import { createTrajet } from './db/documents/trajet.document.js'

const GARES = [
    'Paris', 'Lyon', 'Marseille', 'Bordeaux', 
    'Lille', 'Strasbourg', 'Nantes', 'Rennes'
]

const OPTIONS_BASE = [
    { nom: 'Place tranquille', prix: 3, capacite: 50 },
    { nom: 'Prise électrique', prix: 2, capacite: 150 },
    { nom: 'Bagage supplémentaire', prix: 5, capacite: 100 },
    { nom: 'Info par SMS', prix: 1, capacite: 300 },
    { nom: 'Garantie Annulation', prix: 2.9, capacite: 300 }
]

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomTime(minH: number, maxH: number) {
    const h = randomInt(minH, maxH)
    const m = Math.random() > 0.5 ? '00' : '30'
    return `${h.toString().padStart(2, '0')}:${m}`
}

function addHours(time: string, hoursToAdd: number) {
    const [h, m] = time.split(':').map(Number)
    const newH = (h + hoursToAdd) % 24
    return `${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

async function runSeed() {
    await mongoose.connect(MONGODB_URI)
    const Trajet = createTrajet(mongoose)

    console.log('🗑️  Nettoyage de la base de données...')
    await Trajet.deleteMany({})

    const trajets = []
    const today = new Date()
    
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 60)
    
    const endDate = new Date(today)
    endDate.setDate(endDate.getDate() + 60)

    console.log('⏳ Génération des trajets croisés (cela prend environ 5 à 10 secondes)...')

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        for (let i = 0; i < GARES.length; i++) {
            for (let j = 0; j < GARES.length; j++) {
                if (i === j) continue 

                const gare_depart = GARES[i]
                const gare_arrivee = GARES[j]

                const horaires = [
                    getRandomTime(6, 12),
                    getRandomTime(13, 20)
                ]

                for (const heure_depart of horaires) {
                    const duree = randomInt(1, 4)
                    const heure_arrive = addHours(heure_depart, duree)
                    const prix_aller_simple = randomInt(25, 120)

                    const options_disponibles = OPTIONS_BASE

                    trajets.push({
                        gare_depart,
                        gare_arrivee,
                        date: new Date(d),
                        heure_depart,
                        heure_arrive,
                        capacite: randomInt(200, 400),
                        tarifs: { 
                            prix_aller_simple, 
                            prix_aller_retour: Math.round(prix_aller_simple * 1.8) 
                        },
                        options_disponibles
                    })
                }
            }
        }
    }

    const BATCH_SIZE = 2000
    for (let i = 0; i < trajets.length; i += BATCH_SIZE) {
        const batch = trajets.slice(i, i + BATCH_SIZE)
        await Trajet.insertMany(batch)
    }

    console.log(`✅ ${trajets.length} trajets ont été générés avec succès !`)
    
    process.exit(0)
}

runSeed().catch((err) => {
    console.error('❌ Erreur lors de la génération :', err)
    process.exit(1)
})