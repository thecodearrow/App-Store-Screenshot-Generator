# App Store Screenshot Generator

A browser-based tool that turns raw app screenshots into polished, App Store-ready marketing images — complete with device frames, headlines, and customizable backgrounds. Runs entirely offline, no server needed.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3200`.

## How It Works

1. **Select a slot** from the left sidebar (Hero, Training, Strava, Analytics, Social Proof).
2. **Upload a screenshot** by dragging an image into the drop zone or clicking to browse.
3. **Edit the headline** and optional subheadline in the right panel.
4. **Configure brand settings** — background, accent color, font, font weight, app name, and logo.
5. **Preview** each slot live in the center canvas. Switch device sizes with the header tabs.
6. **Export** — download a single screenshot or export all as a ZIP with App Store-ready PNGs, a contact sheet, and a re-importable project JSON.

## Features

- **5 template slots** with recommended headlines (re-orderable, individually toggleable)
- **Live canvas preview** at exact App Store resolutions
- **12 background presets** — 7 dark + 5 light, grouped in the UI
- **Dark presets** — Deep Space, Midnight, Carbon, Ember, Forest, Slate, Abyss
- **Light presets** — Cloud, Dawn, Ocean, Lavender, Mint (Apple-style clean pastels)
- **Realistic device frame** — titanium edge with metallic specular highlights, 3-layer shadow system, Dynamic Island with camera lens detail, side buttons with cylindrical gradients
- **Automatic text sizing** — headlines fit within 2 lines, always legible
- **Font weight toggle** — switch between Medium (600) and Bold (800) headlines
- **Logo support** — upload a logo that renders alongside the app name above the headline
- **Mode-aware rendering** — text, shadows, device frame, and vignette all adapt to light/dark backgrounds
- **Validation engine** — detects missing screenshots, Settings screens, YouTube content, low resolution
- **Multi-device export** — iPhone 6.7", iPhone 6.5", iPad 12.9"
- **Contact sheet** — all screenshots in one overview image
- **Project JSON** — export/import all settings to regenerate later
- **Fully offline** — runs entirely in the browser, no server, no data leaves your machine

## Export Sizes

| Device        | Dimensions      |
| ------------- | --------------- |
| iPhone 6.7"   | 1290 x 2796     |
| iPhone 6.5"   | 1242 x 2688     |
| iPad 12.9"    | 2048 x 2732     |

## Customization

### Adding New Background Presets

Edit `BG_PRESETS` in `src/engine/templates.js`:

```js
'my-preset': {
  label: 'My Preset',
  mode: 'dark',         // 'dark' or 'light'
  noiseOpacity: 0.02,   // 0 for light presets
  stops: [
    { pos: 0.0, color: '#020209' },
    { pos: 0.3, color: '#06101e' },
    { pos: 0.6, color: '#0b1a2f' },
    { pos: 1.0, color: '#081428' },
  ],
  glowColor: '#2060c0',
  glowSecondary: '#1040a0',
  angle: 168,
},
```

### Adding New Template Slots

Add an entry to `TEMPLATE_SLOTS` in `src/engine/templates.js`:

```js
{
  id: 'your-id',
  name: 'Display Name',
  defaultHeadline: 'Your Headline Here',
  defaultSubheadline: '',
  emphasis: 'What this slot highlights',
  order: 5,
}
```

### Adding New Device Sizes

Edit `DEVICE_SIZES` in `src/engine/templates.js`:

```js
'iphone-6.1': {
  label: 'iPhone 6.1"',
  width: 1179,
  height: 2556,
  platform: 'iphone',
},
```

## Project JSON Format

The exported `project.json` captures all settings so you can re-import and regenerate later. Screenshots are not stored in the JSON — re-upload them after import.

```json
{
  "version": "1.0.0",
  "selectedDevices": ["iphone-6.7"],
  "socialProofNumber": "10,000",
  "brand": {
    "bgStyle": "deep-space",
    "accentColor": "#4A9EFF",
    "fontFamily": "Inter",
    "fontWeight": 800,
    "appName": "MyApp"
  },
  "slots": [
    {
      "id": "hero",
      "headline": "Your AI Coach for Every Race",
      "subheadline": "",
      "enabled": true,
      "order": 0
    }
  ]
}
```

## Tech Stack

- **Vite** + **React** — fast dev server and build
- **HTML5 Canvas** — pixel-perfect rendering and export
- **JSZip** + **FileSaver.js** — client-side ZIP generation
- No server, no backend — everything runs in the browser

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server.

## License

MIT
