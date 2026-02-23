import React, { useState } from 'react';
import { validateAll, canExport } from '../engine/validator.js';
import { exportAll } from '../utils/exporter.js';
import { DEVICE_SIZES } from '../engine/templates.js';

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
