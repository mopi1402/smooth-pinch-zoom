# SCSS Functions

Ce dossier contient les fonctions SCSS utilitaires pour la lib `smooth-pinch-zoom`.

## zoom-clamp()

Fonction utilitaire pour créer des valeurs `clamp()` avec gestion automatique du zoom.

### Syntaxe

```scss
@use "smooth-pinch-zoom/scss" as *;

zoom-clamp($min, $preferred, $max, $pow: 1)
```

### Paramètres

- `$min` : Valeur minimale (ex: `0.25rem`)
- `$preferred` : Valeur préférée (ex: `1rem`)
- `$max` : Valeur maximale (ex: `1rem`)
- `$pow` : Puissance du zoom (optionnel, par défaut: 1, max: 5)

### Exemples

```scss
// Puissance 1 (par défaut)
padding: zoom-clamp(0.25rem, 1rem, 1rem);
// Génère: clamp(0.25rem, calc(1rem / (var(--zoom))), 1rem)

// Puissance 2
padding: zoom-clamp(0.25rem, 1rem, 1rem, 2);
// Génère: clamp(0.25rem, calc(1rem / (var(--zoom) * var(--zoom))), 1rem)

// Puissance 3
padding: zoom-clamp(0.125rem, 1.5rem, 1.5rem, 3);
// Génère: clamp(0.125rem, calc(1.5rem / (var(--zoom) * var(--zoom) * var(--zoom))), 1.5rem)
```

### Utilisation

```scss
@use "smooth-pinch-zoom/scss" as *;

.my-element {
  padding: zoom-clamp(0.5rem, 1.5rem, 1.5rem, 2);
  margin: zoom-clamp(0.25rem, 1rem, 1rem);
  gap: zoom-clamp(0.125rem, 0.5rem, 0.5rem, 3);
}
```
