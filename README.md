# 📚 Analyses Linéaires — Bac de Français

Site collaboratif de révision pour l'oral de français. Toutes les modifications sont sauvegardées dans Firebase et accessibles par quiconque ayant le lien.

## 🚀 Mise en place (20 minutes)

### 1. Firebase — Créer ta base de données gratuite

1. Va sur [console.firebase.google.com](https://console.firebase.google.com)
2. Clique **Ajouter un projet** → donne-lui un nom (ex: `analyses-bac`)
3. Dans le menu gauche : **Build → Firestore Database**
4. Clique **Créer une base de données** → choisir **Mode test** (30 jours gratuit, ensuite tu ajoutes les règles de sécurité)
5. Dans le menu gauche : **Project Overview** → clique **</>** (Web app)
6. Donne un nom à l'app, clique **Enregistrer**
7. **Copie** le bloc `firebaseConfig` qui s'affiche

### 2. Coller ta config dans le projet

Ouvre `js/firebase-config.js` et remplace les valeurs :

```js
const firebaseConfig = {
  apiKey: "Ta-vraie-clé-ici",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet-id",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3. Mettre sur GitHub Pages

1. Crée un repo GitHub (ex: `analyses-bac`)
2. Upload tous les fichiers du projet
3. Dans **Settings → Pages** → Source : **main branch, root folder**
4. Ton site sera dispo sur `https://ton-username.github.io/analyses-bac`

Et voilà ! Toutes les modifications (ajout d'analyses, de textes, d'œuvres) sont sauvegardées dans Firebase et visibles par tout le monde.

---

## 📖 Comment utiliser le site

### Navigation
- Clique sur une **œuvre** dans le menu gauche pour voir ses textes
- Clique sur un **texte** pour voir l'analyse complète avec le texte intégral surligné

### Ajouter du contenu
- **+ Ajouter une œuvre** : bouton en bas du menu gauche
- **+ Ajouter un texte** : dans la page d'une œuvre, ou dans le menu
- **+ Ajouter un mouvement** : dans la page d'un texte
- **+ Ajouter un procédé** : dans chaque bloc mouvement

### Supprimer
- Passe la souris sur un procédé → le bouton **✕** apparaît

---

## 📁 Structure des fichiers

```
analyses-bac/
├── index.html              ← Page principale
├── css/
│   └── style.css           ← Tout le style
├── js/
│   ├── firebase-config.js  ← ⚠️ À configurer
│   ├── data.js             ← Accès Firebase + données initiales
│   └── app.js              ← Logique de l'application
└── README.md
```

---

## 🔒 Sécurité (optionnel)

Le mode test de Firestore expire après 30 jours. Pour prolonger, va dans **Firestore → Règles** et remplace par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Cela permet à tout le monde de lire et écrire. Parfait pour une révision collaborative entre amis de confiance.

---

## ✨ Fonctionnalités

- 🎨 Mode clair / sombre
- 📱 Responsive mobile
- 🔍 Recherche dans le menu
- ✍️ Ajout collaboratif en temps réel (Firebase)
- 🎯 Textes surlignés par mouvement (bleu, vert, orange, violet)
- 🖨️ Impression optimisée
