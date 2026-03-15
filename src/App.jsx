import React, { useState, useCallback } from 'react';
import { createDefaultProject, createNewSlot, DEVICE_SIZES } from './engine/templates.js';
import { validateAll } from './engine/validator.js';
import { exportSingle } from './utils/exporter.js';
import SlotList from './components/SlotList.jsx';
import Preview from './components/Preview.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import ExportModal from './components/ExportModal.jsx';
import './App.css';

export default function App() {
  const [project, setProject] = useState(createDefaultProject);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('iphone-6.7');

  const selectedSlot = project.slots[project.selectedSlotIndex];

  // --- Slot handlers ---

  const handleSelectSlot = useCallback((index) => {
    setProject((p) => ({ ...p, selectedSlotIndex: index }));
  }, []);

  const handleSlotChange = useCallback((index, changes) => {
    setProject((p) => {
      const newSlots = [...p.slots];
      newSlots[index] = { ...newSlots[index], ...changes };
      return { ...p, slots: newSlots };
    });
  }, []);

  const handleReorder = useCallback((fromIndex, toIndex) => {
    setProject((p) => {
      const newSlots = [...p.slots];
      const [moved] = newSlots.splice(fromIndex, 1);
      newSlots.splice(toIndex, 0, moved);
      // Update order
      newSlots.forEach((s, i) => (s.order = i));
      // Adjust selected index
      let newSelectedIndex = p.selectedSlotIndex;
      if (p.selectedSlotIndex === fromIndex) {
        newSelectedIndex = toIndex;
      } else if (
        fromIndex < p.selectedSlotIndex &&
        toIndex >= p.selectedSlotIndex
      ) {
        newSelectedIndex--;
      } else if (
        fromIndex > p.selectedSlotIndex &&
        toIndex <= p.selectedSlotIndex
      ) {
        newSelectedIndex++;
      }
      return { ...p, slots: newSlots, selectedSlotIndex: newSelectedIndex };
    });
  }, []);

  const handleAddSlot = useCallback(() => {
    setProject((p) => {
      const newSlot = createNewSlot(p.slots.length);
      const newSlots = [...p.slots, newSlot];
      return { ...p, slots: newSlots, selectedSlotIndex: newSlots.length - 1 };
    });
  }, []);

  const handleRemoveSlot = useCallback((index) => {
    setProject((p) => {
      if (p.slots.length <= 1) return p;
      const newSlots = p.slots.filter((_, i) => i !== index);
      newSlots.forEach((s, i) => (s.order = i));
      let newSelectedIndex = p.selectedSlotIndex;
      if (newSelectedIndex >= newSlots.length) {
        newSelectedIndex = newSlots.length - 1;
      } else if (index < p.selectedSlotIndex) {
        newSelectedIndex--;
      }
      return { ...p, slots: newSlots, selectedSlotIndex: newSelectedIndex };
    });
  }, []);

  const handleToggleSlot = useCallback((index) => {
    setProject((p) => {
      const newSlots = [...p.slots];
      newSlots[index] = { ...newSlots[index], enabled: !newSlots[index].enabled };
      return { ...p, slots: newSlots };
    });
  }, []);

  // --- Brand handlers ---

  const handleBrandChange = useCallback((changes) => {
    setProject((p) => ({
      ...p,
      brand: { ...p.brand, ...changes },
    }));
  }, []);

  const handleLogoUpload = useCallback((dataUrl) => {
    setProject((p) => ({
      ...p,
      brand: { ...p.brand, logoDataUrl: dataUrl },
    }));
  }, []);

  // --- Device handlers ---

  // Toggle a device for export. Also switches preview to it when checking on.
  const handleDeviceToggle = useCallback((deviceKey) => {
    setProject((p) => {
      const isAdding = !p.selectedDevices.includes(deviceKey);
      const selected = isAdding
        ? [...p.selectedDevices, deviceKey]
        : p.selectedDevices.filter((d) => d !== deviceKey);
      // Ensure at least one device
      if (selected.length === 0) return p;
      return { ...p, selectedDevices: selected };
    });
    // Also switch preview to the checked device
    setPreviewDevice((prev) => {
      // Only switch if we're adding it (not unchecking)
      return deviceKey;
    });
  }, []);

  const handleSocialProofChange = useCallback((value) => {
    setProject((p) => ({ ...p, socialProofNumber: value }));
  }, []);

  // --- Preview device switching (header tabs) ---
  // Also ensures the device is included in export selection.

  const handlePreviewDeviceChange = useCallback((deviceKey) => {
    setPreviewDevice(deviceKey);
    // Also ensure this device is selected for export
    setProject((p) => {
      if (p.selectedDevices.includes(deviceKey)) return p;
      return { ...p, selectedDevices: [...p.selectedDevices, deviceKey] };
    });
  }, []);

  // --- Export single ---

  const handleExportSingle = useCallback(async () => {
    await exportSingle({
      slot: selectedSlot,
      brand: project.brand,
      deviceKey: previewDevice,
      socialProofNumber: project.socialProofNumber,
    });
  }, [selectedSlot, project.brand, previewDevice, project.socialProofNumber]);

  // --- Import project JSON ---

  const handleImportProject = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.version && data.slots && data.brand) {
            setProject((p) => ({
              ...p,
              selectedDevices: data.selectedDevices || p.selectedDevices,
              socialProofNumber: data.socialProofNumber || '',
              brand: {
                ...p.brand,
                bgStyle: data.brand.bgStyle || p.brand.bgStyle,
                accentColor: data.brand.accentColor || p.brand.accentColor,
                fontFamily: data.brand.fontFamily || p.brand.fontFamily,
                fontWeight: data.brand.fontWeight || 800,
                appName: data.brand.appName || '',
              },
              slots: p.slots.map((slot) => {
                const imported = data.slots.find((s) => s.id === slot.id);
                if (imported) {
                  return {
                    ...slot,
                    headline: imported.headline || slot.headline,
                    subheadline: imported.subheadline || '',
                    enabled: imported.enabled !== undefined ? imported.enabled : true,
                  };
                }
                return slot;
              }),
            }));
            alert('Project settings imported. Re-upload screenshots to complete.');
          }
        } catch (err) {
          alert('Invalid project file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  // Validation summary
  const validationResults = validateAll(project.slots, {
    socialProofNumber: project.socialProofNumber,
    deviceSize: DEVICE_SIZES[previewDevice],
  });
  const errorCount = validationResults.filter((r) => r.level === 'error').length;
  const warningCount = validationResults.filter((r) => r.level === 'warning').length;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__left">
          <h1 className="header__title">Screenshot Generator</h1>
          <span className="header__subtitle">App Store Ready</span>
        </div>
        <div className="header__center">
          {Object.entries(DEVICE_SIZES).map(([key, device]) => (
            <button
              key={key}
              className={`device-tab ${previewDevice === key ? 'device-tab--active' : ''}`}
              onClick={() => handlePreviewDeviceChange(key)}
            >
              {device.label}
            </button>
          ))}
        </div>
        <div className="header__right">
          <button className="btn btn--ghost" onClick={handleImportProject}>
            Import
          </button>
          <button className="btn btn--ghost" onClick={handleExportSingle}>
            Export Single
          </button>
          <button
            className="btn btn--primary"
            onClick={() => setExportModalOpen(true)}
          >
            Export All
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main">
        {/* Left Sidebar */}
        <aside className="sidebar sidebar--left">
          <SlotList
            slots={project.slots}
            selectedIndex={project.selectedSlotIndex}
            onSelect={handleSelectSlot}
            onReorder={handleReorder}
            onToggle={handleToggleSlot}
            onAdd={handleAddSlot}
            onRemove={handleRemoveSlot}
          />
        </aside>

        {/* Center Preview */}
        <main className="center">
          <Preview
            slot={selectedSlot}
            brand={project.brand}
            deviceKey={previewDevice}
            socialProofNumber={project.socialProofNumber}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar sidebar--right">
          <SettingsPanel
            slot={selectedSlot}
            slotIndex={project.selectedSlotIndex}
            brand={project.brand}
            selectedDevices={project.selectedDevices}
            previewDevice={previewDevice}
            socialProofNumber={project.socialProofNumber}
            onSlotChange={handleSlotChange}
            onBrandChange={handleBrandChange}
            onDeviceToggle={handleDeviceToggle}
            onSocialProofChange={handleSocialProofChange}
            onLogoUpload={handleLogoUpload}
          />
        </aside>
      </div>

      {/* Status Bar */}
      <footer className="status-bar">
        <div className="status-bar__left">
          {errorCount === 0 && warningCount === 0 ? (
            <span className="status-bar__item status-bar__item--pass">
              All checks passed
            </span>
          ) : (
            <>
              {errorCount > 0 && (
                <span className="status-bar__item status-bar__item--error">
                  {errorCount} error{errorCount > 1 ? 's' : ''}
                </span>
              )}
              {warningCount > 0 && (
                <span className="status-bar__item status-bar__item--warning">
                  {warningCount} warning{warningCount > 1 ? 's' : ''}
                </span>
              )}
            </>
          )}
        </div>
        <div className="status-bar__right">
          <span>
            {project.slots.filter((s) => s.enabled && s.screenshotDataUrl).length}/
            {project.slots.filter((s) => s.enabled).length} screenshots ready
          </span>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        slots={project.slots}
        brand={project.brand}
        selectedDevices={project.selectedDevices}
        socialProofNumber={project.socialProofNumber}
      />
    </div>
  );
}
