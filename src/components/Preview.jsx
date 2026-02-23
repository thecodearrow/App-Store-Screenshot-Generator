import React, { useRef, useEffect, useState, useCallback } from 'react';
import { composeScreenshot, loadImage } from '../engine/composer.js';
import { DEVICE_SIZES } from '../engine/templates.js';

export default function Preview({
  slot,
  brand,
  deviceKey,
  socialProofNumber,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasScale, setCanvasScale] = useState(0.25);

  const device = DEVICE_SIZES[deviceKey];
  const { width: deviceW, height: deviceH } = device;

  // Calculate display scale to fit container
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.clientWidth - 48;
    const containerH = containerRef.current.clientHeight - 60;
    const scaleW = containerW / deviceW;
    const scaleH = containerH / deviceH;
    setCanvasScale(Math.min(scaleW, scaleH));
  }, [deviceW, deviceH]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Render preview whenever inputs change
  useEffect(() => {
    let cancelled = false;

    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Process social proof placeholder
      const processedSlot = { ...slot };
      if (slot.id === 'social' && socialProofNumber) {
        processedSlot.headline = slot.headline
          .replace('X+', `${socialProofNumber}+`)
          .replace('X ', `${socialProofNumber} `);
      }

      const screenshotImg = slot.screenshotDataUrl
        ? await loadImage(slot.screenshotDataUrl)
        : null;
      const logoImg = brand.logoDataUrl
        ? await loadImage(brand.logoDataUrl)
        : null;

      if (cancelled) return;

      await composeScreenshot({
        canvas,
        width: deviceW,
        height: deviceH,
        slot: processedSlot,
        brand,
        screenshotImg,
        logoImg,
      });
    }

    render();
    return () => { cancelled = true; };
  }, [slot, brand, deviceW, deviceH, socialProofNumber]);

  const displayW = Math.round(deviceW * canvasScale);
  const displayH = Math.round(deviceH * canvasScale);

  return (
    <div className="preview" ref={containerRef}>
      <div className="preview__canvas-wrapper">
        <canvas
          key={deviceKey}
          ref={canvasRef}
          style={{
            width: displayW,
            height: displayH,
          }}
        />
        <div className="preview__size-label">
          {device.label} — {deviceW}×{deviceH}
        </div>
      </div>
    </div>
  );
}
