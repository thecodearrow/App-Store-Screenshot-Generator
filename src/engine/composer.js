import { BG_PRESETS, getPresetMode } from './templates.js';

// ═══════════════════════════════════════════════════════════
// WORLD-CLASS APP STORE SCREENSHOT COMPOSER
//
// Design principles:
// 1. Device DOMINATES — 75%+ of canvas height
// 2. Headline is MASSIVE — 2 lines max, fills width
// 3. Background has DEPTH — layered gradients + noise + glow
// 4. Premium feel — metallic frame, deep shadows, clean crop
// 5. Single visual system — consistent across all 5 screenshots
// ═══════════════════════════════════════════════════════════

// ─── Device frame specs ──────────────────────────────────

const FRAMES = {
  iphone: {
    bezelTop: 0.018,
    bezelBottom: 0.018,
    bezelSide: 0.018,
    bodyRadius: 0.12,
    screenRadius: 0.095,
    // Dynamic Island — realistic pill proportions (~4:1 aspect)
    diWidth: 0.28,
    diHeight: 0.035,
    diY: 0.005,
    // Buttons
    powerW: 0.007, powerH: 0.055, powerY: 0.18,
    volW: 0.007, volH: 0.035, volGap: 0.012, volY: 0.16,
    muteW: 0.007, muteH: 0.020, muteY: 0.11,
  },
  ipad: {
    bezelTop: 0.015,
    bezelBottom: 0.015,
    bezelSide: 0.013,
    bodyRadius: 0.06,
    screenRadius: 0.045,
    diWidth: 0, diHeight: 0, diY: 0,
    powerW: 0.005, powerH: 0.03, powerY: 0.10,
    volW: 0.005, volH: 0.022, volGap: 0.008, volY: 0.08,
    muteW: 0, muteH: 0, muteY: 0,
  },
};

// ─── Canvas primitives ───────────────────────────────────

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Text engine ─────────────────────────────────────────

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function fitText(ctx, text, maxW, maxH, family, weight = 800, maxLines = 2) {
  const minSz = 32;
  const startSz = Math.min(Math.round(maxW * 0.16), 200);
  for (let sz = startSz; sz >= minSz; sz -= 2) {
    ctx.font = `${weight} ${sz}px "${family}", "Inter", system-ui, sans-serif`;
    const lines = wrapText(ctx, text, maxW);
    const lh = sz * 1.08;
    if (lines.length <= maxLines && lines.length * lh <= maxH) {
      return { sz, lines, lh };
    }
  }
  ctx.font = `${weight} ${minSz}px "${family}", "Inter", system-ui, sans-serif`;
  return { sz: minSz, lines: wrapText(ctx, text, maxW).slice(0, maxLines), lh: minSz * 1.08 };
}

// ─── Background system (5 layers) ────────────────────────

function drawBackground(ctx, W, H, bgKey, accent) {
  const bg = BG_PRESETS[bgKey] || BG_PRESETS['deep-space'];
  const isLight = bg.mode === 'light';
  const rad = (bg.angle * Math.PI) / 180;
  const diag = Math.hypot(W, H) / 2;
  const cx = W / 2, cy = H / 2;
  const x0 = cx - Math.cos(rad) * diag, y0 = cy - Math.sin(rad) * diag;
  const x1 = cx + Math.cos(rad) * diag, y1 = cy + Math.sin(rad) * diag;

  // Layer 1: Rich multi-stop base gradient
  const base = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const s of bg.stops) base.addColorStop(s.pos, s.color);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // Layer 2: Large accent orb glow (upper area, behind headline)
  const glowAlpha1 = isLight ? '0A' : '18';
  const glowAlpha2 = isLight ? '05' : '0A';
  const glowAlpha3 = isLight ? '02' : '04';
  const g1 = ctx.createRadialGradient(W * 0.5, H * 0.08, 0, W * 0.5, H * 0.08, W * 0.8);
  g1.addColorStop(0, bg.glowColor + glowAlpha1);
  g1.addColorStop(0.3, bg.glowColor + glowAlpha2);
  g1.addColorStop(0.7, bg.glowSecondary + glowAlpha3);
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H * 0.5);

  // Layer 3: Secondary glow (accent-colored, centered on device)
  const accentAlpha1 = isLight ? '04' : '08';
  const accentAlpha2 = isLight ? '02' : '03';
  const g2 = ctx.createRadialGradient(W * 0.5, H * 0.55, 0, W * 0.5, H * 0.55, W * 0.6);
  g2.addColorStop(0, accent + accentAlpha1);
  g2.addColorStop(0.5, accent + accentAlpha2);
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, H * 0.2, W, H * 0.7);

  // Layer 4: Film grain noise (skip for light mode when noiseOpacity is 0)
  if (bg.noiseOpacity > 0) {
    drawNoise(ctx, W, H, bg.noiseOpacity);
  }

  // Layer 5: Vignette (white edges for light, dark edges for dark)
  const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.9);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, isLight ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

function drawNoise(ctx, W, H, opacity) {
  const s = 4; // downsample factor
  const nW = Math.ceil(W / s);
  const nH = Math.ceil(H / s);
  const off = document.createElement('canvas');
  off.width = nW;
  off.height = nH;
  const nc = off.getContext('2d');
  const img = nc.createImageData(nW, nH);
  const d = img.data;
  const maxAlpha = 255 * opacity;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() > 0.5 ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = Math.random() * maxAlpha;
  }
  nc.putImageData(img, 0, 0);
  ctx.drawImage(off, 0, 0, W, H);
}

// ─── Headline renderer ───────────────────────────────────

function drawHeadline(ctx, W, H, slot, brand, headTop, headEnd, mode, logoImg) {
  const isLight = mode === 'light';
  const M = Math.round(W * 0.06);
  const CW = W - M * 2;
  const headH = headEnd - headTop;
  const weight = brand.fontWeight || 800;

  // Logo + App name badge row
  let textTop = headTop;
  const hasLogo = logoImg && logoImg.naturalWidth > 0;
  const hasAppName = !!brand.appName;

  if (hasLogo || hasAppName) {
    const badgeSz = Math.round(W * 0.022);
    const logoH = Math.round(badgeSz * 1.6);

    if (hasLogo) {
      // Scale logo to fit badge height, preserving aspect ratio
      const logoAspect = logoImg.naturalWidth / logoImg.naturalHeight;
      const drawnH = logoH;
      const drawnW = Math.round(drawnH * logoAspect);
      const maxLogoW = Math.round(CW * 0.25);
      const finalW = Math.min(drawnW, maxLogoW);
      const finalH = Math.round(finalW / logoAspect);

      if (hasAppName) {
        // Logo + text side by side, centered
        ctx.save();
        ctx.font = `600 ${badgeSz}px "${brand.fontFamily}", "Inter", system-ui, sans-serif`;
        const textW = ctx.measureText(brand.appName.toUpperCase()).width;
        ctx.restore();

        const gap = Math.round(W * 0.012);
        const totalW = finalW + gap + textW;
        const startX = (W - totalW) / 2;
        const logoY = textTop + (finalH > badgeSz ? 0 : (badgeSz - finalH) / 2);
        const textY = textTop + (finalH > badgeSz ? (finalH - badgeSz) / 2 : 0);

        ctx.save();
        ctx.drawImage(logoImg, startX, logoY, finalW, finalH);
        ctx.restore();

        ctx.save();
        ctx.font = `600 ${badgeSz}px "${brand.fontFamily}", "Inter", system-ui, sans-serif`;
        ctx.fillStyle = isLight ? 'rgba(29,29,31,0.35)' : 'rgba(255,255,255,0.35)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(brand.appName.toUpperCase(), startX + finalW + gap, textY);
        ctx.restore();

        textTop += Math.max(finalH, badgeSz) + Math.round(W * 0.02);
      } else {
        // Logo only, centered
        const logoX = (W - finalW) / 2;
        ctx.save();
        ctx.drawImage(logoImg, logoX, textTop, finalW, finalH);
        ctx.restore();
        textTop += finalH + Math.round(W * 0.02);
      }
    } else {
      // App name only (no logo)
      ctx.save();
      ctx.font = `600 ${badgeSz}px "${brand.fontFamily}", "Inter", system-ui, sans-serif`;
      ctx.fillStyle = isLight ? 'rgba(29,29,31,0.35)' : 'rgba(255,255,255,0.35)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(brand.appName.toUpperCase(), W / 2, textTop);
      ctx.restore();
      textTop += badgeSz + Math.round(W * 0.02);
    }
  }

  const text = slot.headline || '';
  if (!text) return;

  const availH = headEnd - textTop - Math.round(H * 0.01);
  const headlineH = slot.subheadline ? availH * 0.72 : availH * 0.85;
  const { sz, lines, lh } = fitText(ctx, text, CW, headlineH, brand.fontFamily, weight);

  // Calculate vertical position
  const totalH = lines.length * lh;
  const subSz = slot.subheadline ? Math.max(Math.round(sz * 0.34), 22) : 0;
  const subLh = subSz * 1.5;
  const combined = totalH + (slot.subheadline ? subLh : 0);
  const textY = textTop + (availH - combined) / 2;

  // Draw headline with depth shadow
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = `${weight} ${sz}px "${brand.fontFamily}", "Inter", system-ui, sans-serif`;

  // Shadow layer
  ctx.fillStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.4)';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], W / 2, textY + i * lh + sz * 0.03);
  }

  // Main text
  ctx.fillStyle = isLight ? '#1d1d1f' : '#FFFFFF';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], W / 2, textY + i * lh);
  }
  ctx.restore();

  // Subheadline
  if (slot.subheadline) {
    ctx.save();
    ctx.font = `400 ${subSz}px "${brand.fontFamily}", "Inter", system-ui, sans-serif`;
    ctx.fillStyle = isLight ? 'rgba(29,29,31,0.45)' : 'rgba(255,255,255,0.45)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(slot.subheadline, W / 2, textY + totalH + sz * 0.18);
    ctx.restore();
  }
}

// ─── Device frame renderer ───────────────────────────────

function drawDevice(ctx, scrW, scrH, cx, cy, platform, mode) {
  const F = FRAMES[platform] || FRAMES.iphone;
  const isLight = mode === 'light';

  const bL = Math.round(scrW * F.bezelSide);
  const bT = Math.round(scrH * F.bezelTop);
  const bW = scrW + bL * 2;
  const bH = scrH + bT * 2;
  const bX = cx - bW / 2;
  const bY = cy - bH / 2;
  const bR = Math.round(bW * F.bodyRadius);
  const sR = Math.round(bW * F.screenRadius);
  const sX = bX + bL;
  const sY = bY + bT;
  const eW = Math.max(Math.round(bW * 0.007), 3);

  // ── Shadow 1: Wide ambient glow ──
  ctx.save();
  ctx.shadowColor = isLight ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = bW * 0.20;
  ctx.shadowOffsetY = bW * 0.03;
  rr(ctx, bX, bY, bW, bH, bR);
  ctx.fillStyle = isLight ? '#f0f0f2' : '#1a1a1e';
  ctx.fill();
  ctx.restore();

  // ── Shadow 2: Medium directional drop ──
  ctx.save();
  ctx.shadowColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = bW * 0.08;
  ctx.shadowOffsetY = bW * 0.045;
  rr(ctx, bX, bY, bW, bH, bR);
  ctx.fillStyle = isLight ? '#f0f0f2' : '#1a1a1e';
  ctx.fill();
  ctx.restore();

  // ── Shadow 3: Tight contact shadow ──
  ctx.save();
  ctx.shadowColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = bW * 0.02;
  ctx.shadowOffsetY = bW * 0.008;
  rr(ctx, bX, bY, bW, bH, bR);
  ctx.fillStyle = isLight ? '#f0f0f2' : '#1a1a1e';
  ctx.fill();
  ctx.restore();

  // ── Titanium outer edge (thicker, metallic gradient) ──
  ctx.save();
  rr(ctx, bX - eW, bY - eW, bW + eW * 2, bH + eW * 2, bR + eW);
  const edgeG = ctx.createLinearGradient(bX, bY, bX, bY + bH);
  if (isLight) {
    edgeG.addColorStop(0, '#e2e2e8');
    edgeG.addColorStop(0.08, '#dcdce2');
    edgeG.addColorStop(0.25, '#d0d0d6');
    edgeG.addColorStop(0.42, '#d8d8df');
    edgeG.addColorStop(0.50, '#dddde4');
    edgeG.addColorStop(0.58, '#d8d8df');
    edgeG.addColorStop(0.75, '#ccccd2');
    edgeG.addColorStop(0.92, '#c4c4ca');
    edgeG.addColorStop(1, '#c0c0c6');
  } else {
    edgeG.addColorStop(0, '#5a5a62');
    edgeG.addColorStop(0.08, '#505058');
    edgeG.addColorStop(0.25, '#42424a');
    edgeG.addColorStop(0.42, '#4c4c54');
    edgeG.addColorStop(0.50, '#525258');
    edgeG.addColorStop(0.58, '#4c4c54');
    edgeG.addColorStop(0.75, '#3a3a42');
    edgeG.addColorStop(0.92, '#303038');
    edgeG.addColorStop(1, '#2a2a30');
  }
  ctx.fillStyle = edgeG;
  ctx.fill();
  ctx.restore();

  // ── Edge horizontal specular band (simulates cylindrical metal reflection) ──
  ctx.save();
  rr(ctx, bX - eW, bY - eW, bW + eW * 2, bH + eW * 2, bR + eW);
  ctx.clip();
  const edgeSpec = ctx.createLinearGradient(bX - eW, 0, bX + bW + eW, 0);
  edgeSpec.addColorStop(0, 'rgba(255,255,255,0)');
  edgeSpec.addColorStop(0.25, isLight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)');
  edgeSpec.addColorStop(0.5, isLight ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.09)');
  edgeSpec.addColorStop(0.75, isLight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)');
  edgeSpec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = edgeSpec;
  ctx.fillRect(bX - eW, bY - eW, bW + eW * 2, bH + eW * 2);
  ctx.restore();

  // ── Body surface ──
  ctx.save();
  rr(ctx, bX, bY, bW, bH, bR);
  const bodyG = ctx.createLinearGradient(bX, bY, bX, bY + bH);
  if (isLight) {
    bodyG.addColorStop(0, '#fafafa');
    bodyG.addColorStop(0.04, '#f7f7f9');
    bodyG.addColorStop(0.5, '#f3f3f5');
    bodyG.addColorStop(0.96, '#eeeeef');
    bodyG.addColorStop(1, '#eaeaec');
  } else {
    bodyG.addColorStop(0, '#262629');
    bodyG.addColorStop(0.04, '#232326');
    bodyG.addColorStop(0.5, '#1e1e21');
    bodyG.addColorStop(0.96, '#191919');
    bodyG.addColorStop(1, '#151517');
  }
  ctx.fillStyle = bodyG;
  ctx.fill();
  ctx.restore();

  // ── Inner frame shadows (subtle darkening near screen cutout) ──
  ctx.save();
  rr(ctx, bX, bY, bW, bH, bR);
  ctx.clip();
  const inShadowD = bT * 1.5;
  const isTop = ctx.createLinearGradient(bX, bY, bX, bY + inShadowD);
  isTop.addColorStop(0, isLight ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.18)');
  isTop.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = isTop;
  ctx.fillRect(bX, bY, bW, inShadowD);
  const isBot = ctx.createLinearGradient(bX, bY + bH, bX, bY + bH - inShadowD);
  isBot.addColorStop(0, isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.12)');
  isBot.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = isBot;
  ctx.fillRect(bX, bY + bH - inShadowD, bW, inShadowD);
  ctx.restore();

  // ── Top specular highlight ──
  ctx.save();
  rr(ctx, bX, bY, bW, bH, bR);
  ctx.clip();
  const spec = ctx.createLinearGradient(bX, bY, bX, bY + bH * 0.04);
  spec.addColorStop(0, isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)');
  spec.addColorStop(0.5, isLight ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.04)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.fillRect(bX, bY, bW, bH * 0.04);
  ctx.restore();

  // ── Left edge highlight ──
  ctx.save();
  rr(ctx, bX, bY, bW, bH, bR);
  ctx.clip();
  const leftSpec = ctx.createLinearGradient(bX, bY, bX + bW * 0.018, bY);
  leftSpec.addColorStop(0, isLight ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)');
  leftSpec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = leftSpec;
  ctx.fillRect(bX, bY, bW * 0.018, bH);
  ctx.restore();

  // ── Right edge highlight ──
  ctx.save();
  rr(ctx, bX, bY, bW, bH, bR);
  ctx.clip();
  const rightSpec = ctx.createLinearGradient(bX + bW, bY, bX + bW - bW * 0.012, bY);
  rightSpec.addColorStop(0, isLight ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.04)');
  rightSpec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = rightSpec;
  ctx.fillRect(bX + bW - bW * 0.012, bY, bW * 0.012, bH);
  ctx.restore();

  // ── Bottom catch light ──
  ctx.save();
  rr(ctx, bX, bY, bW, bH, bR);
  ctx.clip();
  const botSpec = ctx.createLinearGradient(bX, bY + bH, bX, bY + bH - bH * 0.006);
  botSpec.addColorStop(0, isLight ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)');
  botSpec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = botSpec;
  ctx.fillRect(bX, bY + bH - bH * 0.006, bW, bH * 0.006);
  ctx.restore();

  // ── Power button (right) — cylindrical gradient with shadow ──
  const pwW = Math.max(Math.round(bW * F.powerW), 4);
  const pwH = Math.round(bH * F.powerH);
  const pwX = bX + bW + eW - 1;
  const pwY = bY + Math.round(bH * F.powerY);
  ctx.save();
  ctx.shadowColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = pwW;
  ctx.shadowOffsetX = pwW * 0.3;
  rr(ctx, pwX, pwY, pwW, pwH, pwW * 0.4);
  const pwG = ctx.createLinearGradient(pwX, pwY, pwX + pwW, pwY);
  if (isLight) {
    pwG.addColorStop(0, '#dedee4');
    pwG.addColorStop(0.35, '#d2d2d8');
    pwG.addColorStop(0.55, '#d8d8de');
    pwG.addColorStop(1, '#cacad0');
  } else {
    pwG.addColorStop(0, '#48484e');
    pwG.addColorStop(0.35, '#3a3a40');
    pwG.addColorStop(0.55, '#404046');
    pwG.addColorStop(1, '#323238');
  }
  ctx.fillStyle = pwG;
  ctx.fill();
  ctx.restore();

  // ── Volume buttons (left) — cylindrical gradient with shadow ──
  const vW = Math.max(Math.round(bW * F.volW), 4);
  const vH = Math.round(bH * F.volH);
  const vX = bX - eW - vW + 1;
  const vY1 = bY + Math.round(bH * F.volY);
  const vY2 = vY1 + vH + Math.round(bH * F.volGap);

  for (const vy of [vY1, vY2]) {
    ctx.save();
    ctx.shadowColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = vW;
    ctx.shadowOffsetX = -vW * 0.3;
    rr(ctx, vX, vy, vW, vH, vW * 0.4);
    const vG = ctx.createLinearGradient(vX + vW, vy, vX, vy);
    if (isLight) {
      vG.addColorStop(0, '#dedee4');
      vG.addColorStop(0.35, '#d2d2d8');
      vG.addColorStop(0.55, '#d8d8de');
      vG.addColorStop(1, '#cacad0');
    } else {
      vG.addColorStop(0, '#48484e');
      vG.addColorStop(0.35, '#3a3a40');
      vG.addColorStop(0.55, '#404046');
      vG.addColorStop(1, '#323238');
    }
    ctx.fillStyle = vG;
    ctx.fill();
    ctx.restore();
  }

  // ── Mute switch ──
  if (F.muteH > 0) {
    const mH = Math.round(bH * F.muteH);
    const mY = bY + Math.round(bH * F.muteY);
    ctx.save();
    ctx.shadowColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = vW;
    ctx.shadowOffsetX = -vW * 0.3;
    rr(ctx, vX, mY, vW, mH, vW * 0.4);
    const mG = ctx.createLinearGradient(vX + vW, mY, vX, mY);
    if (isLight) {
      mG.addColorStop(0, '#dedee4');
      mG.addColorStop(1, '#cacad0');
    } else {
      mG.addColorStop(0, '#48484e');
      mG.addColorStop(1, '#323238');
    }
    ctx.fillStyle = mG;
    ctx.fill();
    ctx.restore();
  }

  // ── Screen bezel groove (thin dark inset ring where frame meets screen) ──
  const grooveW = Math.max(Math.round(bW * 0.0025), 1);
  ctx.save();
  rr(ctx, sX - grooveW, sY - grooveW, scrW + grooveW * 2, scrH + grooveW * 2, sR + grooveW);
  ctx.fillStyle = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.7)';
  ctx.fill();
  ctx.restore();

  // ── True black screen inset ──
  ctx.save();
  rr(ctx, sX, sY, scrW, scrH, sR);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.restore();

  return {
    sX, sY, scrW, scrH, sR,
    bX, bY, bW, bH,
    di: F.diWidth > 0 ? {
      x: sX + (scrW - Math.round(scrW * F.diWidth)) / 2,
      y: sY + Math.round(scrH * F.diY),
      w: Math.round(scrW * F.diWidth),
      h: Math.round(scrH * F.diHeight),
      r: Math.round(Math.round(scrH * F.diHeight) * 0.5),
    } : null,
  };
}

function drawDynamicIsland(ctx, di) {
  if (!di) return;

  // ── Main pill shape with subtle gradient ──
  ctx.save();
  rr(ctx, di.x, di.y, di.w, di.h, di.r);
  const diG = ctx.createLinearGradient(di.x, di.y, di.x, di.y + di.h);
  diG.addColorStop(0, '#0c0c0c');
  diG.addColorStop(0.4, '#000000');
  diG.addColorStop(1, '#060606');
  ctx.fillStyle = diG;
  ctx.fill();
  ctx.restore();

  // ── Outer ring border ──
  ctx.save();
  rr(ctx, di.x, di.y, di.w, di.h, di.r);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // ── Inner shadow for depth (top edge darker) ──
  ctx.save();
  rr(ctx, di.x, di.y, di.w, di.h, di.r);
  ctx.clip();
  const diInner = ctx.createLinearGradient(di.x, di.y, di.x, di.y + di.h * 0.4);
  diInner.addColorStop(0, 'rgba(0,0,0,0.4)');
  diInner.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = diInner;
  ctx.fillRect(di.x, di.y, di.w, di.h * 0.4);
  ctx.restore();

  // ── Front camera lens (right-of-center in the pill) ──
  const lensR = Math.max(Math.round(di.h * 0.20), 3);
  const lensX = di.x + di.w * 0.70;
  const lensY = di.y + di.h / 2;

  // Lens body
  ctx.save();
  ctx.beginPath();
  ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2);
  ctx.fillStyle = '#04040a';
  ctx.fill();

  // Lens ring
  ctx.beginPath();
  ctx.arc(lensX, lensY, lensR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.6;
  ctx.stroke();

  // Tiny specular catch on lens
  ctx.beginPath();
  ctx.arc(lensX - lensR * 0.25, lensY - lensR * 0.25, Math.max(lensR * 0.15, 1), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.fill();
  ctx.restore();
}

// ─── Bottom fade ─────────────────────────────────────────

function drawBottomFade(ctx, W, H, bgKey) {
  const bg = BG_PRESETS[bgKey] || BG_PRESETS['deep-space'];
  const bottom = bg.stops[bg.stops.length - 1].color;

  // Parse hex to rgba for smooth alpha blending
  const r = parseInt(bottom.slice(1, 3), 16);
  const g = parseInt(bottom.slice(3, 5), 16);
  const b = parseInt(bottom.slice(5, 7), 16);

  const fadeH = Math.round(H * 0.10);
  const grad = ctx.createLinearGradient(0, H - fadeH, 0, H);
  grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.3)`);
  grad.addColorStop(0.6, `rgba(${r},${g},${b},0.7)`);
  grad.addColorStop(0.85, `rgba(${r},${g},${b},0.92)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},1)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - fadeH, W, fadeH);
}

// ─── Accent glow under device ────────────────────────────

function drawDeviceGlow(ctx, cx, bottomY, deviceW, accent, mode) {
  const isLight = mode === 'light';
  const gW = deviceW * 0.6;
  const gH = deviceW * 0.08;
  const gY = bottomY;
  const g = ctx.createRadialGradient(cx, gY, 0, cx, gY, gW * 0.5);
  g.addColorStop(0, accent + (isLight ? '0A' : '15'));
  g.addColorStop(0.5, accent + (isLight ? '04' : '08'));
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(cx - gW / 2, gY - gH, gW, gH * 2);
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPOSE FUNCTION
// ═══════════════════════════════════════════════════════════

export async function composeScreenshot({
  canvas, width, height, slot, brand, screenshotImg, logoImg,
}) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const W = width, H = height;

  // Resolve mode once from preset
  const mode = getPresetMode(brand.bgStyle);
  const isLight = mode === 'light';

  // Detect platform
  const platform = (W / H) > 0.6 ? 'ipad' : 'iphone';

  // ── Layout constants ──
  const HEAD_TOP = Math.round(H * 0.035);
  const HEAD_END = Math.round(H * 0.235);
  const DEVICE_START = HEAD_END + Math.round(H * 0.005);
  const SIDE_MARGIN = Math.round(W * 0.065);
  const OVERFLOW = Math.round(H * 0.065);

  // ── 1. Rich layered background ──
  drawBackground(ctx, W, H, brand.bgStyle, brand.accentColor);

  // ── 2. Top accent line ──
  const aLine = ctx.createLinearGradient(W * 0.15, 0, W * 0.85, 0);
  aLine.addColorStop(0, 'transparent');
  aLine.addColorStop(0.5, brand.accentColor + (isLight ? '20' : '40'));
  aLine.addColorStop(1, 'transparent');
  ctx.fillStyle = aLine;
  ctx.fillRect(0, 0, W, Math.max(Math.round(H * 0.001), 2));

  // ── 3. Headline + logo ──
  drawHeadline(ctx, W, H, slot, brand, HEAD_TOP, HEAD_END, mode, logoImg);

  // ── 4. Device + screenshot ──
  if (screenshotImg) {
    const imgW = screenshotImg.naturalWidth;
    const imgH = screenshotImg.naturalHeight;
    const F = FRAMES[platform] || FRAMES.iphone;
    const bezelW = 1 + F.bezelSide * 2;
    const bezelH = 1 + F.bezelTop + F.bezelBottom;

    // Available space for the entire device body
    const availW = W - SIDE_MARGIN * 2;
    const availH = (H - DEVICE_START) + OVERFLOW;

    // Fit screen inside device inside available space
    const maxScrW = availW / bezelW;
    const maxScrH = availH / bezelH;
    const sc = Math.min(maxScrW / imgW, maxScrH / imgH, 1.5);
    const scrW = Math.round(imgW * sc);
    const scrH = Math.round(imgH * sc);

    // Center horizontally, top-align with small gap
    const deviceBodyH = scrH * bezelH;
    const topPad = Math.round(H * 0.008);
    const cx = W / 2;
    const cy = DEVICE_START + topPad + deviceBodyH / 2;

    // Glow behind device
    const deviceBottom = cy + deviceBodyH / 2;
    drawDeviceGlow(ctx, cx, Math.min(deviceBottom, H), scrW * bezelW, brand.accentColor, mode);

    // Device frame
    const dev = drawDevice(ctx, scrW, scrH, cx, cy, platform, mode);

    // Screenshot clipped into screen area
    ctx.save();
    rr(ctx, dev.sX, dev.sY, dev.scrW, dev.scrH, dev.sR);
    ctx.clip();
    ctx.drawImage(screenshotImg, dev.sX, dev.sY, dev.scrW, dev.scrH);
    ctx.restore();

    // Dynamic Island on top
    drawDynamicIsland(ctx, dev.di);

    // Screen inner edge shadows (bezel casting shadow onto display)
    ctx.save();
    rr(ctx, dev.sX, dev.sY, dev.scrW, dev.scrH, dev.sR);
    ctx.clip();
    const edgeShadowD = Math.round(dev.scrW * 0.006);
    // Top edge
    const sInTop = ctx.createLinearGradient(dev.sX, dev.sY, dev.sX, dev.sY + edgeShadowD);
    sInTop.addColorStop(0, 'rgba(0,0,0,0.25)');
    sInTop.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sInTop;
    ctx.fillRect(dev.sX, dev.sY, dev.scrW, edgeShadowD);
    // Left edge
    const sInLeft = ctx.createLinearGradient(dev.sX, dev.sY, dev.sX + edgeShadowD, dev.sY);
    sInLeft.addColorStop(0, 'rgba(0,0,0,0.12)');
    sInLeft.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sInLeft;
    ctx.fillRect(dev.sX, dev.sY, edgeShadowD, dev.scrH);
    // Right edge
    const sInRight = ctx.createLinearGradient(dev.sX + dev.scrW, dev.sY, dev.sX + dev.scrW - edgeShadowD, dev.sY);
    sInRight.addColorStop(0, 'rgba(0,0,0,0.08)');
    sInRight.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sInRight;
    ctx.fillRect(dev.sX + dev.scrW - edgeShadowD, dev.sY, edgeShadowD, dev.scrH);
    ctx.restore();

    // Glass reflection (subtle curved highlight across screen)
    ctx.save();
    rr(ctx, dev.sX, dev.sY, dev.scrW, dev.scrH, dev.sR);
    ctx.clip();
    const refl = ctx.createLinearGradient(dev.sX, dev.sY, dev.sX, dev.sY + dev.scrH * 0.10);
    refl.addColorStop(0, 'rgba(255,255,255,0.04)');
    refl.addColorStop(0.5, 'rgba(255,255,255,0.015)');
    refl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = refl;
    ctx.fillRect(dev.sX, dev.sY, dev.scrW, dev.scrH * 0.10);
    ctx.restore();

    // Bottom fade
    drawBottomFade(ctx, W, H, brand.bgStyle);

  } else {
    // ── Placeholder (no screenshot) ──
    const phW = Math.round((W - SIDE_MARGIN * 2) * 0.55);
    const phH = Math.round((H - DEVICE_START) * 0.72);
    const phX = (W - phW) / 2;
    const phY = DEVICE_START + ((H - DEVICE_START) - phH) * 0.3;
    const phR = Math.round(phW * 0.12);

    ctx.save();
    rr(ctx, phX, phY, phW, phH, phR);
    ctx.fillStyle = isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.012)';
    ctx.fill();
    ctx.setLineDash([14, 10]);
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Inner screen ghost
    const inset = Math.round(phW * 0.014);
    ctx.save();
    rr(ctx, phX + inset, phY + inset, phW - inset * 2, phH - inset * 2, phR - inset);
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    ctx.save();
    ctx.font = `500 ${Math.round(W * 0.024)}px "${brand.fontFamily}", system-ui, sans-serif`;
    ctx.fillStyle = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.10)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Drop screenshot here', W / 2, phY + phH / 2);
    ctx.restore();

    drawBottomFade(ctx, W, H, brand.bgStyle);
  }
}

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

export function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    if (!dataUrl) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function generateContactSheet({ slots, brand, deviceSize, loadedImages, logoImg }) {
  const { width: sW, height: sH } = deviceSize;
  const enabled = slots.filter((s) => s.enabled);
  if (enabled.length === 0) return null;

  const mode = getPresetMode(brand.bgStyle);
  const isLight = mode === 'light';

  const sc = 0.22;
  const tW = Math.round(sW * sc);
  const tH = Math.round(sH * sc);
  const gap = 24;
  const pad = 50;

  const cW = pad * 2 + enabled.length * tW + (enabled.length - 1) * gap;
  const cH = pad * 2 + tH;

  const sheet = document.createElement('canvas');
  sheet.width = cW;
  sheet.height = cH;
  const sc2 = sheet.getContext('2d');
  sc2.fillStyle = isLight ? '#f5f5f7' : '#060608';
  sc2.fillRect(0, 0, cW, cH);

  const tmp = document.createElement('canvas');
  for (let i = 0; i < enabled.length; i++) {
    const slot = enabled[i];
    await composeScreenshot({
      canvas: tmp, width: sW, height: sH, slot, brand,
      screenshotImg: loadedImages[slot.id] || null, logoImg,
    });
    const x = pad + i * (tW + gap);
    sc2.drawImage(tmp, 0, 0, sW, sH, x, pad, tW, tH);
  }
  return sheet;
}
