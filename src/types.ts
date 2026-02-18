/**
 * Generation Preset Types
 *
 * A preset bundles all the tuning knobs for a use case.
 * Every field except id/name/description/category is optional —
 * presets only override what they care about.
 */

/** Logo type as defined by @mcptoolshop/logo-studio */
export type LogoType = 'wordmark' | 'symbol' | 'combination' | 'emblem' | 'lettermark';

/** Prompt variant ordering */
export type PromptVariant = 'object-forward' | 'composition-forward';

/** A generation preset bundles all tuning knobs for a use case. */
export interface GenerationPreset {
  /** Unique slug (e.g., 'tech-startup') */
  id: string;
  /** Human-readable name */
  name: string;
  /** One-line description */
  description: string;
  /** Preset category for grouping */
  category: 'industry' | 'aesthetic' | 'custom';

  // ─── Compiler-layer overrides ───────────────────────────
  /** Preferred style (maps through canonicalStyle in logo-studio) */
  style?: string;
  /** Preferred logo type */
  logoType?: LogoType;
  /** Preferred composition */
  composition?: string;
  /** Extra negative phrases to inject */
  extraNegatives?: string[];
  /** Preferred prompt variant */
  variant?: PromptVariant | 'both';

  // ─── Backend-layer overrides ────────────────────────────
  /** Recommended checkpoint (ComfyUI) */
  checkpoint?: string;
  /** Together AI model ID */
  model?: string;
  /** Sampler (ComfyUI) */
  sampler?: string;
  /** Scheduler (ComfyUI) */
  scheduler?: string;
  /** CFG scale */
  cfg?: number;
  /** Diffusion steps */
  steps?: number;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
}

/** Format for user preset files (.json) */
export interface PresetFile {
  /** Schema version (currently 1) */
  version: 1;
  /** Array of custom presets */
  presets: GenerationPreset[];
}
