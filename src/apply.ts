/**
 * Preset Application
 *
 * Merges preset values into CompileOptions and GenOptions.
 * User-provided values always take precedence over preset values.
 *
 * The interfaces here are intentionally loose (Record-shaped) so that
 * this package doesn't need to import logo-studio's full type system
 * at runtime — it's a peer dependency, not a hard dependency.
 */

import type { GenerationPreset } from './types.js';

/** Compile options shape (matches @mcptoolshop/logo-studio CompileOptions) */
export interface CompileOptionsLike {
  style?: string;
  logoType?: string;
  variant?: string;
  extraNegatives?: string[];
  checkpoint?: string;
  [key: string]: unknown;
}

/** Generation options shape (matches @mcptoolshop/logo-studio GenOptions) */
export interface GenOptionsLike {
  checkpoint?: string;
  model?: string;
  sampler?: string;
  scheduler?: string;
  cfg?: number;
  steps?: number;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

/**
 * Apply a preset to compile options.
 * Preset values fill gaps — explicit user values always win.
 */
export function applyPresetToCompileOptions<T extends CompileOptionsLike>(
  preset: GenerationPreset,
  userOptions: T,
): T {
  return {
    ...userOptions,
    style: userOptions.style ?? preset.style,
    logoType: userOptions.logoType ?? preset.logoType,
    variant: userOptions.variant ?? preset.variant,
    extraNegatives: mergeNegatives(preset.extraNegatives, userOptions.extraNegatives),
    checkpoint: userOptions.checkpoint ?? preset.checkpoint,
  };
}

/**
 * Apply a preset to generation options.
 * Preset values fill gaps — explicit user values always win.
 */
export function applyPresetToGenOptions<T extends GenOptionsLike>(
  preset: GenerationPreset,
  userOptions: T,
): T {
  return {
    ...userOptions,
    checkpoint: userOptions.checkpoint ?? preset.checkpoint,
    model: userOptions.model ?? preset.model,
    sampler: userOptions.sampler ?? preset.sampler,
    scheduler: userOptions.scheduler ?? preset.scheduler,
    cfg: userOptions.cfg ?? preset.cfg,
    steps: userOptions.steps ?? preset.steps,
    width: userOptions.width ?? preset.width,
    height: userOptions.height ?? preset.height,
  };
}

/** Merge negative arrays, deduplicating. */
function mergeNegatives(
  presetNeg?: string[],
  userNeg?: string[],
): string[] {
  const merged = [...(presetNeg ?? []), ...(userNeg ?? [])];
  return [...new Set(merged)];
}
