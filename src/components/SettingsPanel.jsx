import React, { useCallback, useState } from 'react';
import {
  BG_PRESETS,
  FONT_OPTIONS,
  DEVICE_SIZES,
  LAYOUT_OPTIONS,
  COPY_PATTERNS,
  NARRATIVE_ARC,
} from '../engine/templates.js';
import { validateFilename } from '../engine/validator.js';

export default function SettingsPanel({
  slot,
  slotIndex,
  brand,
  selectedDevices,
  previewDevice,
  socialProofNumber,
  onSlotChange,
  onBrandChange,
  onDeviceToggle,
  onSocialProofChange,
  onLogoUpload,
}) {
  // Handle screenshot drop/upload
  const handleScreenshotFile = useCallback(
    (file) => {
      if (!file) return;

      // Validate filename
      const warnings = validateFilename(file.name);
      if (warnings.length > 0) {
        const msg = warnings.map((w) => w.message).join('\n');
        if (!window.confirm(`Warning:\n${msg}\n\nContinue anyway?`)) {
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          onSlotChange(slotIndex, {
            screenshotDataUrl: dataUrl,
            screenshotNaturalWidth: img.naturalWidth,
            screenshotNaturalHeight: img.naturalHeight,
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [slotIndex, onSlotChange]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleScreenshotFile(file);
      }
    },
    [handleScreenshotFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const [copyGuideOpen, setCopyGuideOpen] = useState(false);

  // Find the narrative arc tip for the current slot position
  const arcTip = NARRATIVE_ARC[slotIndex] || null;

  return (
    <div className="settings-panel">
      {/* Slot Settings */}
      <div className="settings-section">
        <h3 className="settings-section__title">{slot.name}</h3>

        {slot.id.startsWith('custom-') && (
          <>
            <label className="field-label">Name</label>
            <input
              type="text"
              className="field-input"
              value={slot.name}
              onChange={(e) =>
                onSlotChange(slotIndex, { name: e.target.value })
              }
              placeholder="Screenshot name..."
            />
          </>
        )}

        <label className="field-label">Headline</label>
        <input
          type="text"
          className="field-input"
          value={slot.headline}
          onChange={(e) =>
            onSlotChange(slotIndex, { headline: e.target.value })
          }
          placeholder="Enter headline..."
        />

        <label className="field-label">Subheadline</label>
        <input
          type="text"
          className="field-input"
          value={slot.subheadline}
          onChange={(e) =>
            onSlotChange(slotIndex, { subheadline: e.target.value })
          }
          placeholder="Optional subheadline..."
        />

        {/* Copy Guide */}
        <div className="copy-guide">
          <button
            className="copy-guide__toggle"
            onClick={() => setCopyGuideOpen((o) => !o)}
          >
            <span className="copy-guide__toggle-icon">{copyGuideOpen ? '▾' : '▸'}</span>
            <span>Copy Guide</span>
            {arcTip && <span className="copy-guide__arc-badge">{arcTip.role}</span>}
          </button>

          {copyGuideOpen && (
            <div className="copy-guide__body">
              {arcTip && (
                <div className="copy-guide__arc-tip">
                  <span className="copy-guide__arc-label">Slot {arcTip.position}: {arcTip.role}</span>
                  <span className="copy-guide__arc-desc">{arcTip.tip}</span>
                </div>
              )}

              <div className="copy-guide__patterns">
                {COPY_PATTERNS.map((pattern) => (
                  <div key={pattern.name} className="copy-pattern">
                    <div className="copy-pattern__header">
                      <span className="copy-pattern__name">{pattern.name}</span>
                      <span className="copy-pattern__formula">{pattern.formula}</span>
                    </div>
                    <div className="copy-pattern__examples">
                      {pattern.examples.map((ex, i) => (
                        <button
                          key={i}
                          className="copy-pattern__example"
                          title="Click to use as headline"
                          onClick={() => onSlotChange(slotIndex, { headline: ex })}
                        >
                          "{ex}"
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <label className="field-label">Layout</label>
        <div className="layout-options">
          {LAYOUT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`layout-option ${slot.layout === opt.value ? 'layout-option--active' : ''}`}
              onClick={() => onSlotChange(slotIndex, { layout: opt.value })}
              title={opt.description}
            >
              <span className="layout-option__label">{opt.label}</span>
            </button>
          ))}
        </div>

        {slot.id === 'social' && (
          <>
            <label className="field-label">Runner Count (X)</label>
            <input
              type="text"
              className="field-input"
              value={socialProofNumber}
              onChange={(e) => onSocialProofChange(e.target.value)}
              placeholder="e.g. 10,000"
            />
          </>
        )}

        <label className="field-label">Screenshot</label>
        <div
          className={`drop-zone ${slot.screenshotDataUrl ? 'drop-zone--has-image' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png,image/jpeg,image/webp';
            input.onchange = (e) => handleScreenshotFile(e.target.files[0]);
            input.click();
          }}
        >
          {slot.screenshotDataUrl ? (
            <div className="drop-zone__preview">
              <img src={slot.screenshotDataUrl} alt="Screenshot" />
              <span className="drop-zone__change">Click or drop to replace</span>
            </div>
          ) : (
            <div className="drop-zone__empty">
              <span className="drop-zone__icon">+</span>
              <span>Drop image or click to upload</span>
              <span className="drop-zone__hint">PNG, JPG, WebP</span>
            </div>
          )}
        </div>

        {slot.screenshotDataUrl && (
          <button
            className="btn btn--text btn--danger"
            onClick={() =>
              onSlotChange(slotIndex, {
                screenshotDataUrl: null,
                screenshotNaturalWidth: 0,
                screenshotNaturalHeight: 0,
              })
            }
          >
            Remove screenshot
          </button>
        )}
      </div>

      {/* Device Selection */}
      <div className="settings-section">
        <h3 className="settings-section__title">Export Devices</h3>
        {Object.entries(DEVICE_SIZES).map(([key, device]) => (
          <label key={key} className={`checkbox-label ${previewDevice === key ? 'checkbox-label--previewing' : ''}`}>
            <input
              type="checkbox"
              checked={selectedDevices.includes(key)}
              onChange={() => onDeviceToggle(key)}
            />
            <span>{device.label}</span>
            {previewDevice === key && (
              <span className="checkbox-label__badge">Preview</span>
            )}
            <span className="checkbox-label__size">
              {device.width}×{device.height}
            </span>
          </label>
        ))}
      </div>

      {/* Brand Settings */}
      <div className="settings-section">
        <h3 className="settings-section__title">Brand</h3>

        <label className="field-label">Background</label>
        {['dark', 'light'].map((mode) => {
          const entries = Object.entries(BG_PRESETS).filter(
            ([, p]) => p.mode === mode
          );
          return (
            <div key={mode} className="bg-presets-group">
              <span className="bg-presets-group__label">
                {mode === 'dark' ? 'Dark' : 'Light'}
              </span>
              <div className="bg-presets">
                {entries.map(([key, preset]) => (
                  <button
                    key={key}
                    className={`bg-preset ${brand.bgStyle === key ? 'bg-preset--active' : ''} ${preset.mode === 'light' ? 'bg-preset--light' : ''}`}
                    onClick={() => onBrandChange({ bgStyle: key })}
                    style={{
                      background: `linear-gradient(135deg, ${preset.stops.map((s) => s.color).join(', ')})`,
                    }}
                    title={preset.label}
                  >
                    {brand.bgStyle === key && '✓'}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <label className="field-label">Accent Color</label>
        <div className="color-row">
          <input
            type="color"
            className="color-input"
            value={brand.accentColor}
            onChange={(e) => onBrandChange({ accentColor: e.target.value })}
          />
          <input
            type="text"
            className="field-input field-input--sm"
            value={brand.accentColor}
            onChange={(e) => onBrandChange({ accentColor: e.target.value })}
          />
        </div>

        <label className="field-label">Font</label>
        <select
          className="field-select"
          value={brand.fontFamily}
          onChange={(e) => onBrandChange({ fontFamily: e.target.value })}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <label className="field-label">Font Weight</label>
        <div className="weight-options">
          {[
            { value: 600, label: 'Medium', sample: 'Aa' },
            { value: 800, label: 'Bold', sample: 'Aa' },
          ].map((opt) => (
            <button
              key={opt.value}
              className={`weight-option ${brand.fontWeight === opt.value ? 'weight-option--active' : ''}`}
              onClick={() => onBrandChange({ fontWeight: opt.value })}
            >
              <span
                className="weight-option__sample"
                style={{ fontWeight: opt.value }}
              >
                {opt.sample}
              </span>
              <span className="weight-option__label">{opt.label}</span>
            </button>
          ))}
        </div>

        <label className="field-label">App Name</label>
        <input
          type="text"
          className="field-input"
          value={brand.appName}
          onChange={(e) => onBrandChange({ appName: e.target.value })}
          placeholder="Optional app name..."
        />

        <label className="field-label">Logo</label>
        <div
          className="drop-zone drop-zone--sm"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png,image/jpeg,image/svg+xml';
            input.onchange = (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => onLogoUpload(ev.target.result);
              reader.readAsDataURL(file);
            };
            input.click();
          }}
        >
          {brand.logoDataUrl ? (
            <div className="drop-zone__preview drop-zone__preview--logo">
              <img src={brand.logoDataUrl} alt="Logo" />
              <span className="drop-zone__change">Replace</span>
            </div>
          ) : (
            <span className="drop-zone__empty-sm">+ Upload logo</span>
          )}
        </div>
        {brand.logoDataUrl && (
          <button
            className="btn btn--text btn--danger"
            onClick={() => onLogoUpload(null)}
          >
            Remove logo
          </button>
        )}
      </div>
    </div>
  );
}
