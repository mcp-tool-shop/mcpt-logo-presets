<p align="center">
  <img src="logo.png" alt="mcp-tool-shop" width="420" />
</p>

<h3 align="center">Curated generation presets for @mcptoolshop/logo-studio.<br/>Skip the tuning, start generating.</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@mcptoolshop/logo-presets"><img src="https://img.shields.io/npm/v/@mcptoolshop/logo-presets?color=crimson" alt="npm version" /></a>
  <a href="https://github.com/mcp-tool-shop/mcpt-logo-presets/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license" /></a>
</p>

---

## What is this?

Generation presets for [@mcptoolshop/logo-studio](https://www.npmjs.com/package/@mcptoolshop/logo-studio). Each preset bundles the right checkpoint, sampler, CFG scale, steps, style, and negative prompts for a specific use case. Load a preset, and the tuning is done.

## Install

```bash
npm install @mcptoolshop/logo-presets @mcptoolshop/logo-studio
```

## Quick start

```typescript
import { mine, compile, generate } from '@mcptoolshop/logo-studio';
import {
  loadPreset,
  applyPresetToCompileOptions,
  applyPresetToGenOptions,
} from '@mcptoolshop/logo-presets';

const preset = loadPreset('tech-startup')!;

const mined = await mine({
  name: 'Acme',
  description: 'We build bridges between legacy systems and modern cloud infrastructure.',
});

const compiled = compile(mined, applyPresetToCompileOptions(preset, {}));
const result = await generate(compiled, applyPresetToGenOptions(preset, {
  backend: 'together',
}));
```

## Available presets

| ID | Style | Best for |
|---|---|---|
| `tech-startup` | Geometric, clean | Tech companies, developer tools |
| `luxury-brand` | Elegant, metallic | High-end products, fashion, jewelry |
| `gaming` | Bold, dynamic | Games, esports, entertainment |
| `healthcare` | Organic, calming | Medical, wellness, biotech |
| `fintech` | Swiss precision | Finance, banking, insurance |
| `creative-agency` | Expressive, modern | Design studios, creative services |
| `saas` | Minimal, gradient | Software products, cloud services |
| `e-commerce` | Friendly, colorful | Online retail, marketplaces |

## User overrides always win

Presets fill gaps in your options. If you explicitly set a value, it takes precedence:

```typescript
// Preset says cfg: 3.5, but your override wins
const genOptions = applyPresetToGenOptions(preset, {
  backend: 'comfyui',
  cfg: 5.0,        // overrides preset
  steps: 20,       // overrides preset
});
```

## Custom presets

Create a JSON file with your own presets:

```json
{
  "version": 1,
  "presets": [
    {
      "id": "my-brand",
      "name": "My Brand Style",
      "description": "Our specific brand guidelines",
      "category": "custom",
      "style": "minimal",
      "logoType": "wordmark",
      "cfg": 4.0,
      "steps": 25,
      "extraNegatives": ["busy", "ornate"]
    }
  ]
}
```

Load it:

```typescript
import { loadPreset } from '@mcptoolshop/logo-presets';

const preset = loadPreset('my-brand', './my-presets.json');
```

## API

```typescript
// List all presets (built-in + optional user file)
listPresets(userPresetPath?: string): GenerationPreset[]

// Load one preset by ID
loadPreset(id: string, userPresetPath?: string): GenerationPreset | null

// Load user presets from a JSON file
loadUserPresets(filePath: string): GenerationPreset[]

// Apply preset to compile options (user values win)
applyPresetToCompileOptions(preset, userOptions): CompileOptions

// Apply preset to generation options (user values win)
applyPresetToGenOptions(preset, userOptions): GenOptions
```

## License

MIT
