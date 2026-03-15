export const TEMPLATE_SLOTS = [
  {
    id: 'hero',
    name: 'Hero Shot',
    defaultHeadline: 'Your AI Coach for Every Race',
    defaultSubheadline: '',
    emphasis: 'AI chat + context understanding',
    defaultLayout: 'center',
    order: 0,
  },
  {
    id: 'training',
    name: 'Training Plan',
    defaultHeadline: 'Plans That Adapt to You',
    defaultSubheadline: '',
    emphasis: 'Adaptive training intelligence',
    defaultLayout: 'center',
    order: 1,
  },
  {
    id: 'strava',
    name: 'Strava Integration',
    defaultHeadline: 'Your Strava Runs, Smarter',
    defaultSubheadline: '',
    emphasis: 'Strava data integration',
    defaultLayout: 'center',
    order: 2,
  },
  {
    id: 'analytics',
    name: 'Performance Analytics',
    defaultHeadline: 'Track What Matters',
    defaultSubheadline: '',
    emphasis: 'Performance data & insights',
    defaultLayout: 'center',
    order: 3,
  },
  {
    id: 'social',
    name: 'Social Proof',
    defaultHeadline: 'Join X+ Runners',
    defaultSubheadline: '',
    emphasis: 'Community & social proof',
    defaultLayout: 'center',
    order: 4,
  },
];

export const DEVICE_SIZES = {
  'iphone-6.9': {
    label: 'iPhone 6.9"',
    width: 1320,
    height: 2868,
    platform: 'iphone',
  },
  'iphone-6.7': {
    label: 'iPhone 6.7"',
    width: 1290,
    height: 2796,
    platform: 'iphone',
  },
  'iphone-6.5': {
    label: 'iPhone 6.5"',
    width: 1284,
    height: 2778,
    platform: 'iphone',
  },
  'iphone-6.3': {
    label: 'iPhone 6.3"',
    width: 1206,
    height: 2622,
    platform: 'iphone',
  },
  'iphone-6.1': {
    label: 'iPhone 6.1"',
    width: 1125,
    height: 2436,
    platform: 'iphone',
  },
  'ipad-12.9': {
    label: 'iPad 12.9"',
    width: 2048,
    height: 2732,
    platform: 'ipad',
  },
};

export const BG_PRESETS = {
  'deep-space': {
    label: 'Deep Space',
    mode: 'dark',
    noiseOpacity: 0.025,
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
  midnight: {
    label: 'Midnight',
    mode: 'dark',
    noiseOpacity: 0.025,
    stops: [
      { pos: 0.0, color: '#030208' },
      { pos: 0.3, color: '#0e0618' },
      { pos: 0.6, color: '#160a28' },
      { pos: 1.0, color: '#0a0618' },
    ],
    glowColor: '#6030b0',
    glowSecondary: '#4020a0',
    angle: 175,
  },
  carbon: {
    label: 'Carbon',
    mode: 'dark',
    noiseOpacity: 0.025,
    stops: [
      { pos: 0.0, color: '#060606' },
      { pos: 0.3, color: '#0a0a0a' },
      { pos: 0.6, color: '#0f0f0f' },
      { pos: 1.0, color: '#0c0c0c' },
    ],
    glowColor: '#404050',
    glowSecondary: '#303040',
    angle: 180,
  },
  ember: {
    label: 'Ember',
    mode: 'dark',
    noiseOpacity: 0.02,
    stops: [
      { pos: 0.0, color: '#0a0204' },
      { pos: 0.3, color: '#1a0808' },
      { pos: 0.6, color: '#260e0a' },
      { pos: 1.0, color: '#1a0806' },
    ],
    glowColor: '#c04020',
    glowSecondary: '#a03018',
    angle: 170,
  },
  forest: {
    label: 'Forest',
    mode: 'dark',
    noiseOpacity: 0.02,
    stops: [
      { pos: 0.0, color: '#020804' },
      { pos: 0.3, color: '#061408' },
      { pos: 0.6, color: '#0a1e10' },
      { pos: 1.0, color: '#06160a' },
    ],
    glowColor: '#208040',
    glowSecondary: '#106030',
    angle: 172,
  },
  slate: {
    label: 'Slate',
    mode: 'dark',
    noiseOpacity: 0.02,
    stops: [
      { pos: 0.0, color: '#08080c' },
      { pos: 0.3, color: '#12141a' },
      { pos: 0.6, color: '#1a1c24' },
      { pos: 1.0, color: '#14161c' },
    ],
    glowColor: '#506080',
    glowSecondary: '#404860',
    angle: 178,
  },
  abyss: {
    label: 'Abyss',
    mode: 'dark',
    noiseOpacity: 0.025,
    stops: [
      { pos: 0.0, color: '#020206' },
      { pos: 0.3, color: '#040810' },
      { pos: 0.6, color: '#060c1a' },
      { pos: 1.0, color: '#040a14' },
    ],
    glowColor: '#1848a0',
    glowSecondary: '#103080',
    angle: 180,
  },
  cloud: {
    label: 'Cloud',
    mode: 'light',
    noiseOpacity: 0,
    stops: [
      { pos: 0.0, color: '#ffffff' },
      { pos: 0.3, color: '#f5f5f7' },
      { pos: 0.6, color: '#efeff1' },
      { pos: 1.0, color: '#f5f5f7' },
    ],
    glowColor: '#c0c0d0',
    glowSecondary: '#d0d0e0',
    angle: 180,
  },
  dawn: {
    label: 'Dawn',
    mode: 'light',
    noiseOpacity: 0,
    stops: [
      { pos: 0.0, color: '#fff8f5' },
      { pos: 0.3, color: '#fef0ea' },
      { pos: 0.6, color: '#fde8e0' },
      { pos: 1.0, color: '#fef0ea' },
    ],
    glowColor: '#f0b8a0',
    glowSecondary: '#f0c8b8',
    angle: 168,
  },
  ocean: {
    label: 'Ocean',
    mode: 'light',
    noiseOpacity: 0,
    stops: [
      { pos: 0.0, color: '#f0f7ff' },
      { pos: 0.3, color: '#e6f0fc' },
      { pos: 0.6, color: '#dce9f8' },
      { pos: 1.0, color: '#e6f0fc' },
    ],
    glowColor: '#90b8e0',
    glowSecondary: '#a8c8e8',
    angle: 175,
  },
  lavender: {
    label: 'Lavender',
    mode: 'light',
    noiseOpacity: 0,
    stops: [
      { pos: 0.0, color: '#f8f5ff' },
      { pos: 0.3, color: '#f0ecfc' },
      { pos: 0.6, color: '#e8e2f8' },
      { pos: 1.0, color: '#f0ecfc' },
    ],
    glowColor: '#b8a0e0',
    glowSecondary: '#c8b8e8',
    angle: 172,
  },
  mint: {
    label: 'Mint',
    mode: 'light',
    noiseOpacity: 0,
    stops: [
      { pos: 0.0, color: '#f2fbf6' },
      { pos: 0.3, color: '#e8f5ee' },
      { pos: 0.6, color: '#def0e6' },
      { pos: 1.0, color: '#e8f5ee' },
    ],
    glowColor: '#80c8a0',
    glowSecondary: '#a0d8b8',
    angle: 170,
  },
  // ── Orange presets ──
  amber: {
    label: 'Amber',
    mode: 'dark',
    noiseOpacity: 0.02,
    stops: [
      { pos: 0.0, color: '#0c0502' },
      { pos: 0.3, color: '#1c0e04' },
      { pos: 0.6, color: '#2a1608' },
      { pos: 1.0, color: '#1e1006' },
    ],
    glowColor: '#d07020',
    glowSecondary: '#b85a10',
    angle: 170,
  },
  tangerine: {
    label: 'Tangerine',
    mode: 'dark',
    noiseOpacity: 0.02,
    stops: [
      { pos: 0.0, color: '#0a0302' },
      { pos: 0.3, color: '#1e0a04' },
      { pos: 0.6, color: '#301208' },
      { pos: 1.0, color: '#220c04' },
    ],
    glowColor: '#e85d20',
    glowSecondary: '#c84810',
    angle: 172,
  },
  peach: {
    label: 'Peach',
    mode: 'light',
    noiseOpacity: 0,
    stops: [
      { pos: 0.0, color: '#fff6f0' },
      { pos: 0.3, color: '#feede2' },
      { pos: 0.6, color: '#fde4d5' },
      { pos: 1.0, color: '#feede2' },
    ],
    glowColor: '#e8a878',
    glowSecondary: '#f0c0a0',
    angle: 168,
  },
  sunset: {
    label: 'Sunset',
    mode: 'light',
    noiseOpacity: 0,
    stops: [
      { pos: 0.0, color: '#fff4eb' },
      { pos: 0.3, color: '#ffe8d6' },
      { pos: 0.6, color: '#ffdcc2' },
      { pos: 1.0, color: '#ffe8d6' },
    ],
    glowColor: '#e09060',
    glowSecondary: '#f0a880',
    angle: 175,
  },
};

export const LAYOUT_OPTIONS = [
  { value: 'center', label: 'Center', description: 'Phone centered below headline' },
  { value: 'offset-left', label: 'Offset Left', description: 'Phone shifted left, text on right' },
  { value: 'offset-right', label: 'Offset Right', description: 'Phone shifted right, text on left' },
  { value: 'hero-large', label: 'Hero Large', description: 'Larger phone, minimal text' },
  { value: 'text-only', label: 'Text Only', description: 'No phone — headline + feature pills' },
];

export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'system-ui', label: 'System UI' },
  { value: 'Helvetica Neue', label: 'Helvetica Neue' },
  { value: 'SF Pro Display', label: 'SF Pro Display' },
];

// ── Copywriting guidance ─────────────────────────────────
// Based on proven App Store copywriting patterns.
// Each pattern has a formula and examples.
export const COPY_PATTERNS = [
  {
    name: 'Paint a Moment',
    formula: 'Show the user in their best moment using the app',
    examples: [
      'Your morning run, perfectly planned',
      'Wake up to a cleaner inbox',
      'Finally, a budget that keeps up with you',
    ],
  },
  {
    name: 'State an Outcome',
    formula: 'Lead with the result, not the feature',
    examples: [
      'Run faster. Recover smarter.',
      'Save 3 hours every week',
      'Never miss a deadline again',
    ],
  },
  {
    name: 'Kill a Pain',
    formula: 'Name the frustration, then resolve it',
    examples: [
      'No more guessing your pace',
      'Stop losing receipts',
      'Forget spreadsheet chaos',
    ],
  },
  {
    name: 'Social Proof',
    formula: 'Use numbers or community to build trust',
    examples: [
      'Join 50,000+ runners',
      'Trusted by 10,000 teams',
      '#1 in Health & Fitness',
    ],
  },
  {
    name: 'Feature Spotlight',
    formula: 'Highlight one feature with a benefit twist',
    examples: [
      'AI coaching that adapts to you',
      'Strava sync in one tap',
      'Real-time collaboration, zero lag',
    ],
  },
];

// Narrative arc — recommended screenshot ordering
export const NARRATIVE_ARC = [
  { position: 1, role: 'Hero', tip: 'Your strongest benefit. First impression — make it count.' },
  { position: 2, role: 'Differentiator', tip: 'What makes you different? Unique integration or approach.' },
  { position: 3, role: 'Core Feature', tip: 'Show your most-used feature in action.' },
  { position: 4, role: 'Deep Value', tip: 'Analytics, insights, or advanced capability.' },
  { position: 5, role: 'Trust Signal', tip: 'Social proof, community size, or awards.' },
];

// QA checklist items for final review
export const QA_CHECKLIST = [
  { id: 'one-idea', label: 'Each headline communicates one idea in ~1 second', category: 'Copy' },
  { id: 'first-benefit', label: 'First slide sells the strongest user benefit', category: 'Copy' },
  { id: 'no-repeat-layout', label: 'Adjacent slides use different layouts', category: 'Layout' },
  { id: 'readable-thumb', label: 'Text is readable at App Store thumbnail size', category: 'Copy' },
  { id: 'no-block-ui', label: 'Decorative elements don\'t block the UI screenshot', category: 'Layout' },
  { id: 'correct-after-export', label: 'Text and framing look correct after export sizing', category: 'Export' },
  { id: 'no-settings-screen', label: 'No Settings or configuration screens used', category: 'Content' },
  { id: 'all-sizes-exported', label: 'All required device sizes are exported', category: 'Export' },
  { id: 'brand-consistent', label: 'Colors, fonts, and style are consistent across all slides', category: 'Brand' },
  { id: 'logo-visible', label: 'Logo/app name is visible if included', category: 'Brand' },
];

export function createDefaultSlotState(template) {
  return {
    id: template.id,
    name: template.name,
    headline: template.defaultHeadline,
    subheadline: template.defaultSubheadline,
    screenshot: null,
    screenshotDataUrl: null,
    screenshotNaturalWidth: 0,
    screenshotNaturalHeight: 0,
    enabled: true,
    layout: template.defaultLayout || 'center',
    order: template.order,
  };
}

let _nextSlotId = 1;

export function createNewSlot(order) {
  const id = `custom-${_nextSlotId++}`;
  return {
    id,
    name: `Screenshot ${order + 1}`,
    headline: '',
    subheadline: '',
    screenshot: null,
    screenshotDataUrl: null,
    screenshotNaturalWidth: 0,
    screenshotNaturalHeight: 0,
    enabled: true,
    layout: 'center',
    order,
  };
}

export function createDefaultProject() {
  return {
    platform: 'iphone',
    selectedDevices: ['iphone-6.7'],
    selectedSlotIndex: 0,
    slots: TEMPLATE_SLOTS.map(createDefaultSlotState),
    brand: {
      bgStyle: 'deep-space',
      accentColor: '#4A9EFF',
      fontFamily: 'Inter',
      fontWeight: 800,
      appName: '',
      logoDataUrl: null,
    },
    socialProofNumber: '',
  };
}

export function getPresetMode(bgKey) {
  const preset = BG_PRESETS[bgKey];
  return preset ? preset.mode : 'dark';
}
