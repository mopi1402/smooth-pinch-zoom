# SCSS Functions

This folder contains the SCSS utility functions for the `smooth-pinch-zoom` library.

## zoom-clamp()

Utility function to create `clamp()` values with automatic zoom management.

### Syntax

```scss
@use "smooth-pinch-zoom/scss" as *;

zoom-clamp($min, $preferred, $max, $pow: 1)
```

### Parameters

- `$min` : Minimum value (e.g., `0.25rem`)
- `$preferred` : Preferred value (e.g., `1rem`)
- `$max` : Maximum value (e.g., `1rem`)
- `$pow` : Zoom power (optional, default: 1, max: 5)

### Examples

```scss
// Power 1 (default)
padding: zoom-clamp(0.25rem, 1rem, 1rem);
// Generates: clamp(0.25rem, calc(1rem / (var(--zoom))), 1rem)

// Power 2
padding: zoom-clamp(0.25rem, 1rem, 1rem, 2);
// Generates: clamp(0.25rem, calc(1rem / (var(--zoom) * var(--zoom))), 1rem)

// Power 3
padding: zoom-clamp(0.125rem, 1.5rem, 1.5rem, 3);
// Generates: clamp(0.125rem, calc(1.5rem / (var(--zoom) * var(--zoom) * var(--zoom))), 1.5rem)
```

### Usage

```scss
@use "smooth-pinch-zoom/scss" as *;

.my-element {
  padding: zoom-clamp(0.5rem, 1.5rem, 1.5rem, 2);
  margin: zoom-clamp(0.25rem, 1rem, 1rem);
  gap: zoom-clamp(0.125rem, 0.5rem, 0.5rem, 3);
}
```
