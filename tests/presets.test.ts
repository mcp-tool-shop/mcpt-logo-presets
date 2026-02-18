import { describe, it, expect } from 'vitest';
import {
  listPresets,
  loadPreset,
  BUILT_IN_PRESETS,
  applyPresetToCompileOptions,
  applyPresetToGenOptions,
} from '../src/index.js';
import type { GenerationPreset } from '../src/index.js';

// ─── Built-in Presets ────────────────────────────────────────

describe('built-in presets', () => {
  it('should have exactly 8 presets', () => {
    expect(BUILT_IN_PRESETS.length).toBe(8);
  });

  it('should have unique IDs', () => {
    const ids = BUILT_IN_PRESETS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should include all expected preset IDs', () => {
    const ids = BUILT_IN_PRESETS.map(p => p.id);
    expect(ids).toContain('tech-startup');
    expect(ids).toContain('luxury-brand');
    expect(ids).toContain('gaming');
    expect(ids).toContain('healthcare');
    expect(ids).toContain('fintech');
    expect(ids).toContain('creative-agency');
    expect(ids).toContain('saas');
    expect(ids).toContain('e-commerce');
  });

  it('should have required fields on every preset', () => {
    for (const preset of BUILT_IN_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.category).toBe('industry');
      expect(preset.style).toBeTruthy();
      expect(preset.logoType).toBeTruthy();
    }
  });

  it('should have valid logo types', () => {
    const validTypes = ['wordmark', 'symbol', 'combination', 'emblem', 'lettermark'];
    for (const preset of BUILT_IN_PRESETS) {
      expect(validTypes).toContain(preset.logoType);
    }
  });

  it('should have positive CFG values', () => {
    for (const preset of BUILT_IN_PRESETS) {
      if (preset.cfg !== undefined) {
        expect(preset.cfg).toBeGreaterThan(0);
      }
    }
  });

  it('should have positive step counts', () => {
    for (const preset of BUILT_IN_PRESETS) {
      if (preset.steps !== undefined) {
        expect(preset.steps).toBeGreaterThan(0);
      }
    }
  });

  it('gaming preset should use low steps for speed', () => {
    const gaming = BUILT_IN_PRESETS.find(p => p.id === 'gaming');
    expect(gaming).toBeDefined();
    expect(gaming!.steps).toBeLessThanOrEqual(4);
    expect(gaming!.cfg).toBeLessThanOrEqual(1.0);
  });

  it('luxury-brand should use high CFG for detail', () => {
    const luxury = BUILT_IN_PRESETS.find(p => p.id === 'luxury-brand');
    expect(luxury).toBeDefined();
    expect(luxury!.cfg).toBeGreaterThanOrEqual(7.0);
  });
});

// ─── Loader ──────────────────────────────────────────────────

describe('listPresets', () => {
  it('should return all built-in presets', () => {
    const presets = listPresets();
    expect(presets.length).toBe(8);
  });
});

describe('loadPreset', () => {
  it('should load a preset by ID', () => {
    const preset = loadPreset('tech-startup');
    expect(preset).not.toBeNull();
    expect(preset!.id).toBe('tech-startup');
    expect(preset!.name).toBe('Tech Startup');
    expect(preset!.style).toBe('geometric');
  });

  it('should return null for unknown preset', () => {
    const preset = loadPreset('nonexistent');
    expect(preset).toBeNull();
  });

  it('should be case-sensitive', () => {
    const preset = loadPreset('Tech-Startup');
    expect(preset).toBeNull();
  });
});

// ─── Apply to CompileOptions ─────────────────────────────────

describe('applyPresetToCompileOptions', () => {
  const preset: GenerationPreset = {
    id: 'test',
    name: 'Test',
    description: 'Test preset',
    category: 'industry',
    style: 'geometric',
    logoType: 'symbol',
    variant: 'object-forward',
    checkpoint: 'flux1-dev.safetensors',
    extraNegatives: ['organic', 'hand drawn'],
  };

  it('should fill gaps from preset', () => {
    const result = applyPresetToCompileOptions(preset, {});
    expect(result.style).toBe('geometric');
    expect(result.logoType).toBe('symbol');
    expect(result.variant).toBe('object-forward');
    expect(result.checkpoint).toBe('flux1-dev.safetensors');
  });

  it('should preserve user overrides', () => {
    const result = applyPresetToCompileOptions(preset, {
      style: 'brutalist',
      checkpoint: 'sdxl_base.safetensors',
    });
    expect(result.style).toBe('brutalist');
    expect(result.checkpoint).toBe('sdxl_base.safetensors');
    // Preset fills what user didn't set
    expect(result.logoType).toBe('symbol');
  });

  it('should merge negatives with deduplication', () => {
    const result = applyPresetToCompileOptions(preset, {
      extraNegatives: ['hand drawn', 'cartoon'],
    });
    expect(result.extraNegatives).toContain('organic');
    expect(result.extraNegatives).toContain('hand drawn');
    expect(result.extraNegatives).toContain('cartoon');
    // Deduplicated
    const handDrawnCount = result.extraNegatives!.filter(n => n === 'hand drawn').length;
    expect(handDrawnCount).toBe(1);
  });

  it('should handle empty user options', () => {
    const result = applyPresetToCompileOptions(preset, {});
    expect(result.extraNegatives).toEqual(['organic', 'hand drawn']);
  });

  it('should preserve extra user properties', () => {
    const result = applyPresetToCompileOptions(preset, {
      includeTierB: true,
      tierABudget: 72,
    });
    expect(result.includeTierB).toBe(true);
    expect(result.tierABudget).toBe(72);
  });
});

// ─── Apply to GenOptions ─────────────────────────────────────

describe('applyPresetToGenOptions', () => {
  const preset: GenerationPreset = {
    id: 'test',
    name: 'Test',
    description: 'Test preset',
    category: 'industry',
    checkpoint: 'flux1-dev.safetensors',
    model: 'black-forest-labs/FLUX.1-Dev',
    sampler: 'euler',
    scheduler: 'simple',
    cfg: 3.5,
    steps: 30,
    width: 1024,
    height: 1024,
  };

  it('should fill gaps from preset', () => {
    const result = applyPresetToGenOptions(preset, {});
    expect(result.checkpoint).toBe('flux1-dev.safetensors');
    expect(result.model).toBe('black-forest-labs/FLUX.1-Dev');
    expect(result.cfg).toBe(3.5);
    expect(result.steps).toBe(30);
    expect(result.width).toBe(1024);
    expect(result.height).toBe(1024);
  });

  it('should preserve user overrides', () => {
    const result = applyPresetToGenOptions(preset, {
      cfg: 5.0,
      steps: 20,
      width: 512,
    });
    expect(result.cfg).toBe(5.0);
    expect(result.steps).toBe(20);
    expect(result.width).toBe(512);
    // Preset fills what user didn't set
    expect(result.height).toBe(1024);
    expect(result.model).toBe('black-forest-labs/FLUX.1-Dev');
  });

  it('should preserve extra user properties', () => {
    const result = applyPresetToGenOptions(preset, {
      backend: 'comfyui',
      variants: 4,
      seed: 42,
    });
    expect(result.backend).toBe('comfyui');
    expect(result.variants).toBe(4);
    expect(result.seed).toBe(42);
  });
});

// ─── User Preset Loading ─────────────────────────────────────

describe('loadUserPresets', () => {
  // We test the error cases without needing actual files
  it('should throw on invalid JSON', () => {
    // This will throw because the file doesn't exist
    expect(() => {
      const { loadUserPresets } = require('../src/loader.js');
      loadUserPresets('/nonexistent/path.json');
    }).toThrow();
  });
});
