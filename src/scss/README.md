# SCSS Functions

This folder contains the SCSS utility functions for the `smooth-pinch-zoom` library.

## z-clamp()

Utility function to create `clamp()` values with automatic zoom management.

### Syntax

```scss
@use "smooth-pinch-zoom/scss" as *;

z-clamp($min, $preferred, $max, $pow: 1)
```

### Parameters

- `$min` : Minimum value (e.g., `0.25rem`)
- `$preferred` : Preferred value (e.g., `1rem`)
- `$max` : Maximum value (e.g., `1rem`)
- `$pow` : Zoom power (optional, default: 1, max: 5)

### Examples

```scss
// Power 1 (default)
padding: z-clamp(0.25rem, 1rem, 1rem);
// Generates: clamp(0.25rem, calc(1rem / (var(--zoom))), 1rem)

// Power 2
padding: z-clamp(0.25rem, 1rem, 1rem, 2);
// Generates: clamp(0.25rem, calc(1rem / (var(--zoom) * var(--zoom))), 1rem)

// Power 3
padding: z-clamp(0.125rem, 0.5rem, 0.5rem, 3);
// Generates: clamp(0.125rem, calc(0.5rem / (var(--zoom) * var(--zoom) * var(--zoom))), 0.5rem)
```

### Usage

```scss
@use "smooth-pinch-zoom/scss" as *;

.my-element {
  padding: z-clamp(0.5rem, 1.5rem, 1.5rem, 2);
  margin: z-clamp(0.25rem, 1rem, 1rem);
  gap: z-clamp(0.125rem, 0.5rem, 0.5rem, 3);
}
```

## z-fixed()

Utility function to keep elements at a fixed size regardless of zoom level.

### Syntax

```scss
z-fixed($value)
```

### Parameters

- `$value` : Fixed size value (e.g., `24px`, `1rem`)

### Examples

```scss
.icon {
  width: z-fixed(24px); // Always 24px, even when zoomed
  height: z-fixed(24px); // Always 24px, even when zoomed
}

.button {
  padding: z-fixed(12px) z-fixed(24px);
  border-radius: z-fixed(6px);
  font-size: z-fixed(14px);
}
```

### Use Cases

- Icons and buttons that should maintain their size
- Border widths and border-radius
- Font sizes that should remain readable
- Any element that shouldn't scale with zoom

## z-100vh() and z-100vw()

Utility functions to create fullscreen dimensions that adapt to zoom.

### Syntax

```scss
z-100vh($offset: 0)
z-100vw($offset: 0)
```

### Parameters

- `$offset` : Optional offset value (e.g., `-80px`, `var(--header-height)`)

### Examples

```scss
.modal {
  height: z-100vh(); // 100vh that adapts to zoom
  width: z-100vw(); // 100vw that adapts to zoom
}

.overlay {
  height: z-100vh(-80px); // 100vh minus 80px, adapted to zoom
  width: z-100vw(-40px); // 100vw minus 40px, adapted to zoom
}

.fullscreen-container {
  height: z-100vh(var(--header-height, -60px));
  width: z-100vw(var(--sidebar-width, -250px));
}
```

### Use Cases

- Fullscreen modals and overlays
- Hero sections that fill the viewport
- Containers that need to account for fixed headers/sidebars
- Any element that should fill the available space

## Complete Example

```scss
@use "smooth-pinch-zoom/scss" as *;

.responsive-layout {
  // Responsive spacing that adapts to zoom
  padding: z-clamp(0.5rem, 1rem, 2rem);
  gap: z-clamp(0.25rem, 0.5rem, 1rem);

  // Fixed-size elements that don't scale with zoom
  .icon {
    width: z-fixed(24px);
    height: z-fixed(24px);
  }

  // Fullscreen container
  .fullscreen {
    height: z-100vh(-60px); // Account for header
    width: z-100vw();
  }

  // Responsive text
  .title {
    font-size: z-clamp(1.5rem, 2rem, 3rem);
    margin-bottom: z-fixed(16px);
  }
}
```

## Function Naming Convention

All functions follow the `z-` prefix convention:

- **`z-clamp()`** - Zoom-aware clamp values
- **`z-fixed()`** - Fixed size (no zoom scaling)
- **`z-100vh()`** - Zoom-aware viewport height
- **`z-100vw()`** - Zoom-aware viewport width

This makes it easy to identify all zoom-related functions in your SCSS code.
