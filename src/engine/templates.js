export const TEMPLATE_SLOTS = [
  {
    id: 'hero',
    name: 'Hero Shot',
    defaultHeadline: 'Your AI Coach for Every Race',
    defaultSubheadline: '',
    emphasis: 'AI chat + context understanding',
    order: 0,
  },
  {
    id: 'training',
    name: 'Training Plan',
    defaultHeadline: 'Plans That Adapt to You',
    defaultSubheadline: '',
    emphasis: 'Adaptive training intelligence',
    order: 1,
  },
  {
    id: 'strava',
    name: 'Strava Integration',
    defaultHeadline: 'Your Strava Runs, Smarter',
    defaultSubheadline: '',
    emphasis: 'Strava data integration',
    order: 2,
  },
  {
    id: 'analytics',
    name: 'Performance Analytics',
    defaultHeadline: 'Track What Matters',
    defaultSubheadline: '',
    emphasis: 'Performance data & insights',
    order: 3,
  },
  {
    id: 'social',
    name: 'Social Proof',
    defaultHeadline: 'Join X+ Runners',
    defaultSubheadline: '',
    emphasis: 'Community & social proof',
    order: 4,
  },
];

export const DEVICE_SIZES = {
  'iphone-6.7': {
    label: 'iPhone 6.7"',
    width: 1290,
    height: 2796,
    platform: 'iphone',
  },
  'iphone-6.5': {
    label: 'iPhone 6.5"',
    width: 1242,
    height: 2688,
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
};

export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'system-ui', label: 'System UI' },
  { value: 'Helvetica Neue', label: 'Helvetica Neue' },
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
    order: template.order,
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
