import React, { useState } from 'react';
import { validateAll, canExport } from '../engine/validator.js';
import { exportAll } from '../utils/exporter.js';
import { DEVICE_SIZES, QA_CHECKLIST } from '../engine/templates.js';

export default function ExportModal({
  isOpen,
  onClose,
  slots,
  brand,
  selectedDevices,
  socialProofNumber,
}) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState({ step: 0, total: 1 });
  const [overrides, setOverrides] = useState({});
  const [qaChecks, setQaChecks] = useState({});

  if (!isOpen) return null;

  const validationResults = validateAll(slots, {
    socialProofNumber,
    deviceSize: selectedDevices[0]
      ? DEVICE_SIZES[selectedDevices[0]]
      : null,
  });

  const { allowed, reasons } = canExport(validationResults, overrides);

  const errors = validationResults.filter((r) => r.level === 'error');
  const warnings = validationResults.filter((r) => r.level === 'warning');

  const handleExport = async () => {
    setExporting(true);
    setProgress({ step: 0, total: 1 });

    try {
      await exportAll({
        slots,
        brand,
        selectedDevices,
        socialProofNumber,
        onProgress: (step, total) => setProgress({ step, total }),
      });
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
      onClose();
    }
  };

  const progressPercent = Math.round((progress.step / progress.total) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Export Screenshots</h2>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal__body">
          {exporting ? (
            <div className="export-progress">
              <div className="export-progress__bar">
                <div
                  className="export-progress__fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="export-progress__label">
                Rendering... {progressPercent}%
              </p>
            </div>
          ) : (
            <>
              {/* Validation Results */}
              <div className="validation-results">
                <h3>Validation</h3>

                {validationResults.length === 0 && (
                  <div className="validation-item validation-item--pass">
                    All checks passed
                  </div>
                )}

                {errors.map((r, i) => (
                  <div key={`e-${i}`} className="validation-item validation-item--error">
                    <span className="validation-icon">✕</span>
                    {r.message}
                  </div>
                ))}

                {warnings.map((r, i) => (
                  <div key={`w-${i}`} className="validation-item validation-item--warning">
                    <span className="validation-icon">!</span>
                    {r.message}
                    {(r.code === 'SETTINGS_DETECTED') && (
                      <label className="validation-override">
                        <input
                          type="checkbox"
                          checked={!!overrides[r.code]}
                          onChange={(e) =>
                            setOverrides((o) => ({
                              ...o,
                              [r.code]: e.target.checked,
                            }))
                          }
                        />
                        Override and allow
                      </label>
                    )}
                  </div>
                ))}
              </div>

              {/* Export Summary */}
              <div className="export-summary">
                <h3>Export Summary</h3>
                <p>
                  {slots.filter((s) => s.enabled).length} screenshots ×{' '}
                  {selectedDevices.length} device size
                  {selectedDevices.length > 1 ? 's' : ''}
                </p>
                <p className="export-summary__detail">
                  Includes: Individual PNGs + Contact Sheet + Project JSON
                </p>
              </div>

              {/* QA Checklist */}
              <div className="qa-checklist">
                <h3>QA Checklist</h3>
                <p className="qa-checklist__hint">
                  Review before exporting — {Object.values(qaChecks).filter(Boolean).length}/{QA_CHECKLIST.length} checked
                </p>
                {['Copy', 'Layout', 'Content', 'Brand', 'Export'].map((category) => {
                  const items = QA_CHECKLIST.filter((item) => item.category === category);
                  if (items.length === 0) return null;
                  return (
                    <div key={category} className="qa-checklist__group">
                      <span className="qa-checklist__category">{category}</span>
                      {items.map((item) => (
                        <label key={item.id} className="qa-checklist__item">
                          <input
                            type="checkbox"
                            checked={!!qaChecks[item.id]}
                            onChange={(e) =>
                              setQaChecks((prev) => ({
                                ...prev,
                                [item.id]: e.target.checked,
                              }))
                            }
                          />
                          <span className={qaChecks[item.id] ? 'qa-checklist__label--checked' : ''}>
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose} disabled={exporting}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleExport}
            disabled={!allowed || exporting || selectedDevices.length === 0}
          >
            {exporting ? 'Exporting...' : 'Download ZIP'}
          </button>
        </div>
      </div>
    </div>
  );
}
