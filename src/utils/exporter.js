import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { composeScreenshot, loadImage, generateContactSheet } from '../engine/composer.js';
import { DEVICE_SIZES } from '../engine/templates.js';

/**
 * Convert a canvas to a Blob (PNG).
 */
function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
}

/**
 * Export all enabled slots as PNGs in a ZIP.
 *
 * @param {Object} params
 * @param {Array} params.slots - slot state array
 * @param {Object} params.brand - brand config
 * @param {Array<string>} params.selectedDevices - e.g. ['iphone-6.7', 'ipad-12.9']
 * @param {string} params.socialProofNumber
 * @param {Function} params.onProgress - callback(step, total)
 * @returns {Promise<void>}
 */
export async function exportAll({
  slots,
  brand,
  selectedDevices,
  socialProofNumber,
  onProgress,
}) {
  const zip = new JSZip();
  const enabledSlots = slots.filter((s) => s.enabled);

  // Pre-load all images
  const loadedImages = {};
  for (const slot of enabledSlots) {
    if (slot.screenshotDataUrl) {
      loadedImages[slot.id] = await loadImage(slot.screenshotDataUrl);
    }
  }

  const logoImg = brand.logoDataUrl ? await loadImage(brand.logoDataUrl) : null;

  const totalSteps = enabledSlots.length * selectedDevices.length + selectedDevices.length + 1;
  let currentStep = 0;

  const exportCanvas = document.createElement('canvas');

  for (const deviceKey of selectedDevices) {
    const device = DEVICE_SIZES[deviceKey];
    if (!device) continue;

    const folderName = device.label.replace(/[^a-zA-Z0-9]/g, '_');
    const folder = zip.folder(folderName);

    // Render each slot
    for (let i = 0; i < enabledSlots.length; i++) {
      const slot = enabledSlots[i];
      const processedSlot = { ...slot };

      // Replace social proof placeholder
      if (slot.id === 'social' && socialProofNumber) {
        processedSlot.headline = slot.headline.replace('X+', `${socialProofNumber}+`);
        processedSlot.headline = processedSlot.headline.replace('X ', `${socialProofNumber} `);
      }

      await composeScreenshot({
        canvas: exportCanvas,
        width: device.width,
        height: device.height,
        slot: processedSlot,
        brand,
        screenshotImg: loadedImages[slot.id] || null,
        logoImg,
      });

      const blob = await canvasToBlob(exportCanvas);
      const fileName = `${String(i + 1).padStart(2, '0')}_${slot.id}.png`;
      folder.file(fileName, blob);

      currentStep++;
      onProgress?.(currentStep, totalSteps);
    }

    // Contact sheet for this device
    const contactSheet = await generateContactSheet({
      slots: enabledSlots.map((s) => {
        if (s.id === 'social' && socialProofNumber) {
          return {
            ...s,
            headline: s.headline.replace('X+', `${socialProofNumber}+`).replace('X ', `${socialProofNumber} `),
          };
        }
        return s;
      }),
      brand,
      deviceSize: device,
      loadedImages,
      logoImg,
    });

    if (contactSheet) {
      const sheetBlob = await canvasToBlob(contactSheet);
      folder.file('contact_sheet.png', sheetBlob);
    }

    currentStep++;
    onProgress?.(currentStep, totalSteps);
  }

  // Project JSON
  const projectJson = generateProjectJson({ slots, brand, selectedDevices, socialProofNumber });
  zip.file('project.json', JSON.stringify(projectJson, null, 2));

  currentStep++;
  onProgress?.(currentStep, totalSteps);

  // Generate and download ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(content, `screenshots_${timestamp}.zip`);
}

/**
 * Generate a project JSON for re-import.
 */
export function generateProjectJson({ slots, brand, selectedDevices, socialProofNumber }) {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    selectedDevices,
    socialProofNumber,
    brand: {
      bgStyle: brand.bgStyle,
      accentColor: brand.accentColor,
      fontFamily: brand.fontFamily,
      fontWeight: brand.fontWeight,
      appName: brand.appName,
    },
    slots: slots.map((slot) => ({
      id: slot.id,
      name: slot.name,
      headline: slot.headline,
      subheadline: slot.subheadline,
      enabled: slot.enabled,
      order: slot.order,
      hasScreenshot: !!slot.screenshotDataUrl,
    })),
  };
}

/**
 * Export a single slot preview as PNG download.
 */
export async function exportSingle({ slot, brand, deviceKey, socialProofNumber }) {
  const device = DEVICE_SIZES[deviceKey];
  if (!device) return;

  const processedSlot = { ...slot };
  if (slot.id === 'social' && socialProofNumber) {
    processedSlot.headline = slot.headline.replace('X+', `${socialProofNumber}+`).replace('X ', `${socialProofNumber} `);
  }

  const screenshotImg = slot.screenshotDataUrl
    ? await loadImage(slot.screenshotDataUrl)
    : null;
  const logoImg = brand.logoDataUrl ? await loadImage(brand.logoDataUrl) : null;

  const canvas = document.createElement('canvas');
  await composeScreenshot({
    canvas,
    width: device.width,
    height: device.height,
    slot: processedSlot,
    brand,
    screenshotImg,
    logoImg,
  });

  const blob = await canvasToBlob(canvas);
  saveAs(blob, `${slot.id}_${device.label.replace(/[^a-zA-Z0-9]/g, '_')}.png`);
}
