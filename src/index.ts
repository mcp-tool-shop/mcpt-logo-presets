/**
 * @mcptoolshop/logo-presets
 *
 * Curated generation presets for @mcptoolshop/logo-studio.
 * Skip the tuning, start generating.
 */

export type { GenerationPreset, PresetFile, LogoType, PromptVariant } from './types.js';
export { BUILT_IN_PRESETS } from './built-in.js';
export { listPresets, loadPreset, loadUserPresets } from './loader.js';
export { applyPresetToCompileOptions, applyPresetToGenOptions } from './apply.js';
export type { CompileOptionsLike, GenOptionsLike } from './apply.js';
