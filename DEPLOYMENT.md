# 🚀 Déploiement de la Demo

## Déploiement sur Vercel

### Prérequis

1. Installer Vercel CLI : `npm i -g vercel`
2. Avoir un compte Vercel (gratuit)

### Déploiement rapide

#### 1. Déploiement de production

```bash
npm run deploy
```

#### 2. Déploiement de preview

```bash
npm run deploy:preview
```

#### 3. Build de la demo uniquement

```bash
npm run build:demo
```

### Déploiement manuel

#### 1. Build du projet

```bash
npm run build
```

#### 2. Déploiement via Vercel CLI

```bash
vercel --prod
```

### Configuration Vercel

Le fichier `vercel.json` est configuré pour :

- **Déployer le dossier `example/`** comme site statique
- **Rediriger toutes les routes** vers la demo
- **Activer le mode public** pour l'accès direct

### Structure de déploiement

```
example/
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── script.js           # Logique JavaScript
└── (dossier dist/ sera copié automatiquement)
```

### URLs de déploiement

- **Production** : `https://votre-projet.vercel.app`
- **Preview** : `https://votre-projet-git-branch.vercel.app`

### Mise à jour

Pour mettre à jour la demo :

1. Faire vos modifications
2. Commiter et pousser sur Git
3. Lancer `npm run deploy`

### Support des navigateurs

La demo fonctionne sur tous les navigateurs modernes supportant :

- `window.visualViewport` API
- CSS `transform` et `scale`
- ES6+ JavaScript
