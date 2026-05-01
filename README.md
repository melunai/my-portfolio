# Interactive Portfolio — Frontend Experience

A modern portfolio focused on motion, interactivity, and visual depth. Built with React, Framer Motion, and WebGL, the project emphasizes smooth user experience, dynamic rendering, and a cohesive design system.

## Overview

This project is not a static showcase, but an interactive environment. Each section is designed to respond to user input, scroll position, and theme context. The goal is to create a portfolio that feels responsive and alive, while maintaining performance and clarity.

The application combines traditional UI rendering with GPU-driven graphics, blending standard React components with Canvas and Three.js scenes.

## Core Features

The hero section provides two distinct visual experiences depending on the active theme. In light mode, the interface renders an animated atmospheric scene with gradients, motion layers, and subtle environmental effects. In dark mode, it switches to a WebGL-based composition with particles, shaders, and post-processing, creating a more immersive visual entry point.

The interface supports a full theme system based on CSS variables. All colors, surfaces, and effects are derived from tokens, allowing smooth transitions and consistent styling across the application.

Internationalization is implemented with instant language switching. The interface updates without layout shifts or scroll resets, preserving user context during interaction.

The UI is built around glass-like surfaces, soft gradients, and layered depth. Visual elements use blur, glow, and subtle lighting to create a cohesive aesthetic without compromising readability.

Animations are driven by scroll position and viewport visibility. Sections appear progressively using Intersection Observer and motion-based transitions, ensuring that content is revealed in a controlled and performant way.

Projects are presented through interactive cards with tilt effects and smooth hover feedback. Each project opens in a modal that includes a gallery with lazy loading, swipe support, and orientation handling.

The experience section is structured as a timeline with animated progression and expandable entries. It visually communicates growth while remaining interactive.

A custom canvas-based background reacts to cursor movement and time, adding an additional layer of depth without interfering with content.

## Technology Stack

The project is built with React and TypeScript, using Framer Motion for animation and @react-three/fiber for WebGL rendering. TailwindCSS is used alongside a custom token-based theme system. Intersection Observer is used for visibility tracking, and additional rendering is handled through Canvas and shader-based techniques.

## Architecture

The application is organized around modular sections. Each part of the page is implemented as an isolated component, allowing reuse and independent animation logic. Shared UI primitives such as cards, sections, and typography ensure consistency.

Data is separated from presentation through structured configuration files. Localization is handled through a dedicated i18n layer. Styling is centralized using CSS variables and theme tokens.

Rendering is split between standard DOM components and GPU-driven layers. Canvas is used for lightweight dynamic backgrounds, while Three.js powers the more complex 3D scenes.

## Performance Considerations

Animations rely primarily on transform and opacity to remain GPU-friendly. Heavy effects are isolated and controlled to avoid blocking the main thread. Images and non-critical elements are loaded lazily, and motion is reduced automatically when user preferences indicate it.

The project avoids unnecessary reflows and layout shifts, especially during language switching and theme transitions.

## Possible Improvements

Further optimization of WebGL scenes could reduce GPU load on lower-end devices. Code splitting could improve initial load time by deferring non-critical components. A migration to a framework with server-side rendering could enhance SEO and performance. Additional mobile-specific optimizations may improve consistency across devices.

## License

MIT
