/**
 * Preset Loader
 *
 * Load presets from the built-in set or user-defined JSON files.
 */

import { readFileSync } from 'node:fs';
import { BUILT_IN_PRESETS } from './built-in.js';
import type { GenerationPreset, PresetFile } from './types.js';

/**
 * List all available presets.
 * Includes built-in presets and optionally user-defined presets from a JSON file.
 */
export function listPresets(userPresetPath?: string): GenerationPreset[] {
  const all = [...BUILT_IN_PRESETS];
  if (userPresetPath) {
    all.push(...loadUserPresets(userPresetPath));
  }
  return all;
}

/**
 * Load a single preset by ID.
 * Returns null if the preset is not found.
 */
export function loadPreset(
  id: string,
  userPresetPath?: string,
): GenerationPreset | null {
  const all = listPresets(userPresetPath);
  return all.find(p => p.id === id) ?? null;
}

/**
 * Load user-defined presets from a JSON file.
 * The file must follow the PresetFile schema (version: 1).
 */
export function loadUserPresets(filePath: string): GenerationPreset[] {
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as PresetFile;

  if (parsed.version !== 1) {
    throw new Error(`Unsupported preset file version: ${parsed.version}. Expected version 1.`);
  }

  if (!Array.isArray(parsed.presets)) {
    throw new Error('Invalid preset file: "presets" must be an array.');
  }

  return parsed.presets.map(p => ({
    ...p,
    category: p.category ?? 'custom' as const,
  }));
}
