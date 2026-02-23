/**
 * Validation engine for screenshot slots.
 * Returns an array of validation results with level: 'error' | 'warning' | 'info'.
 */

const SETTINGS_KEYWORDS = [
  'settings',
  'preferences',
  'configuration',
  'notifications',
  'privacy',
  'account settings',
  'general settings',
  'app settings',
];

const YOUTUBE_KEYWORDS = [
  'youtube',
  'youtu.be',
  'watch?v=',
  'subscribe',
];

/**
 * Check if headline text suggests a Settings screen.
 */
function looksLikeSettings(text) {
  const lower = (text || '').toLowerCase();
  return SETTINGS_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Check if text suggests YouTube content.
 */
function looksLikeYouTube(text) {
  const lower = (text || '').toLowerCase();
  return YOUTUBE_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Validate a single slot.
 * @param {Object} slot
 * @param {Object} options - { socialProofNumber, deviceSize }
 * @returns {Array<{ level: string, message: string, code: string }>}
 */
export function validateSlot(slot, options = {}) {
  const results = [];

  // Missing screenshot
  if (!slot.screenshotDataUrl) {
    results.push({
      level: 'error',
      message: `"${slot.name}" is missing a screenshot.`,
      code: 'MISSING_SCREENSHOT',
    });
  }

  // Settings screen detection
  if (looksLikeSettings(slot.headline) || looksLikeSettings(slot.subheadline)) {
    results.push({
      level: 'warning',
      message: `"${slot.name}" headline suggests a Settings screen. Settings screens should not be used as selling screenshots.`,
      code: 'SETTINGS_DETECTED',
    });
  }

  // YouTube detection
  if (looksLikeYouTube(slot.headline) || looksLikeYouTube(slot.subheadline)) {
    results.push({
      level: 'error',
      message: `"${slot.name}" contains YouTube-related content. YouTube screenshots are not allowed.`,
      code: 'YOUTUBE_DETECTED',
    });
  }

  // Social proof number validation
  if (slot.id === 'social') {
    const num = options.socialProofNumber;
    if (!num || num.trim() === '') {
      if (slot.headline.includes('X+')) {
        results.push({
          level: 'warning',
          message: 'Social proof slot uses "X+" placeholder. Provide an honest runner count.',
          code: 'SOCIAL_PROOF_PLACEHOLDER',
        });
      }
    }
  }

  // Empty headline
  if (!slot.headline || slot.headline.trim() === '') {
    results.push({
      level: 'error',
      message: `"${slot.name}" has no headline.`,
      code: 'EMPTY_HEADLINE',
    });
  }

  // Check screenshot resolution vs device size (upscaling warning)
  if (slot.screenshotDataUrl && slot.screenshotNaturalWidth && options.deviceSize) {
    const deviceWidth = options.deviceSize.width;
    const screenshotWidth = slot.screenshotNaturalWidth;
    // If screenshot would need >1.5x upscale to fill area, warn
    const usableWidth = deviceWidth * 0.7; // ~70% of canvas used for screenshot
    if (screenshotWidth < usableWidth * 0.5) {
      results.push({
        level: 'warning',
        message: `"${slot.name}" screenshot is low resolution (${screenshotWidth}px wide). It may appear blurry.`,
        code: 'LOW_RESOLUTION',
      });
    }
  }

  return results;
}

/**
 * Validate all slots and return aggregated results.
 */
export function validateAll(slots, options = {}) {
  const allResults = [];

  const enabledSlots = slots.filter((s) => s.enabled);

  if (enabledSlots.length === 0) {
    allResults.push({
      level: 'error',
      message: 'No screenshot slots are enabled.',
      code: 'NO_SLOTS',
    });
    return allResults;
  }

  for (const slot of enabledSlots) {
    const slotResults = validateSlot(slot, options);
    allResults.push(...slotResults);
  }

  return allResults;
}

/**
 * Check if export should be blocked.
 * Export is blocked if there are any errors or unresolved Settings/YouTube warnings.
 */
export function canExport(validationResults, overrides = {}) {
  const errors = validationResults.filter((r) => r.level === 'error');
  if (errors.length > 0) return { allowed: false, reasons: errors };

  const blockers = validationResults.filter(
    (r) =>
      r.level === 'warning' &&
      (r.code === 'SETTINGS_DETECTED' || r.code === 'YOUTUBE_DETECTED') &&
      !overrides[r.code]
  );

  if (blockers.length > 0) return { allowed: false, reasons: blockers };

  return { allowed: true, reasons: [] };
}

/**
 * Detect if an uploaded image filename suggests settings or YouTube content.
 */
export function validateFilename(filename) {
  const results = [];
  const lower = (filename || '').toLowerCase();

  if (SETTINGS_KEYWORDS.some((kw) => lower.includes(kw))) {
    results.push({
      level: 'warning',
      message: `File "${filename}" looks like a Settings screen. Settings screens should not be used as selling screenshots.`,
      code: 'SETTINGS_DETECTED',
    });
  }

  if (YOUTUBE_KEYWORDS.some((kw) => lower.includes(kw))) {
    results.push({
      level: 'error',
      message: `File "${filename}" appears to be YouTube content. YouTube screenshots are not allowed.`,
      code: 'YOUTUBE_DETECTED',
    });
  }

  return results;
}
