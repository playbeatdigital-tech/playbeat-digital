# PlayBeat Digital Architecture (`playbeat.digital`)

## 1. Stack Choices
- **Frontend Core**: Modern Single-Page Enterprise App with high performance vanilla JavaScript & modern CSS variables.
- **3D Graphics Engine**: Three.js (r128) WebGL canvas with interactive particle vortex, holographic 3D digital key mesh, custom shaders, and mouse-reactive parallax.
- **Styling**: Cyberpunk Enterprise Design System, glassmorphism cards, glowing neon accents (#00f0ff cyan, #7928ca violet, #ff0055 magenta, #00ff66 emerald), CSS grid & flexbox.
- **State Management**: Reactive cart and currency store with `localStorage` persistence.
- **Data Source**: Real scraped K4G product catalog (`playbeat_products.json`) containing accurate market pricing, real discounts, live metadata, and high-resolution cover artwork.
- **Checkout Engine**: Instant payment simulator supporting Credit Card, PayPal, and Binance Web3 Pay with instant cryptographically formatted key generation.

## 2. Directory Structure
```
/
├── index.html                   # Main Enterprise 3D Marketplace Application
├── playbeat_products.json       # Product database copied & structured from K4G
├── css/
│   └── style.css                # Enterprise cyber styling, animations, glassmorphism
├── js/
│   ├── app.js                   # Main application logic, cart, currency, search, checkout
│   └── three-scene.js           # Three.js 3D animated hero scene & key visualizer
└── replica/
    ├── recon.md                 # Reverse-engineering reconnaissance map
    ├── features.csv             # Features parity matrix
    ├── architecture.md          # System architecture & technical specs
    └── design/
        └── tokens.json          # Design system tokens (colors, typography, elevation)
```
