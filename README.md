

# ProjectTRAiN - Système de Réservation de TGV

Ce projet est une application de réservation de billets de train (Aller/Retour) développée avec **React (Vite)** pour le frontend et **Fastify (Node.js)** pour le backend, utilisant **MongoDB** comme base de données.

## Prérequis

- **Node.js** (Version 20+ recommandée)

- **MongoDB** (Doit être lancé localement sur le port par défaut `27017`)

---

## Installation et Lancement

### 1. Configuration du Backend

Le serveur de données gère l'authentification, la recherche de trajets et la génération de billets PDF.

```
cd backend
npm install
# Générer les trajets de test (à ne faire qu'une seule fois)
npx tsx src/seed.ts
# Lancer le serveur
npx tsx src/main.ts
```

- **Port du serveur :** `http://localhost:3000`

### 2. Configuration du Frontend

L'interface utilisateur permet de rechercher des trajets, choisir des options et payer.

```
cd frontend
# Utilisation de --legacy-peer-deps pour éviter les conflits de version avec TailwindCSS/Vite
npm install --legacy-peer-deps
# Lancer l'application
npm run dev
```

- **Port du client :** `http://localhost:5173`

---

## 💡 Infos utiles pour la démo

- **Villes disponibles :** Paris, Lyon, Marseille, Bordeaux, Lille, Strasbourg, Nantes, Rennes.

- **Dates de test :** Les trajets sont générés dynamiquement autour de la date du jour (+/- 60 jours). Utilisez des dates actuelles pour vos recherches.

- **Code Promo Adhérent :** Utilisez le code `FIDELITE10` lors du paiement pour bénéficier de -10 € de réduction.

- **Gestion du temps :** Une session expire après **3 minutes d'inactivité**. Un compte à rebours est visible en bas à gauche de l'écran.

- **Authentification :** L'inscription et la connexion sont obligatoires pour finaliser le paiement et accéder à l'onglet "Mes Billets".

---

## 📂 Structure du projet

- `/backend` : API Fastify, Schémas Mongoose, Logique de génération PDF et envoi d'emails.

- `/frontend` : Application React, Tailwind CSS 4, Gestion du panier et des étapes de réservation.
