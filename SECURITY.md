# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Scope

logo-presets is a **pure data library** that exports generation presets for logo-studio.

- **Data touched:** In-memory preset objects (checkpoints, samplers, CFG values, prompts)
- **Data NOT touched:** No filesystem access, no network requests, no user data, no credentials
- **Permissions:** None — pure library with no I/O
- **Network:** None
- **Telemetry:** None collected or sent

## Reporting a Vulnerability

Email: **64996768+mcp-tool-shop@users.noreply.github.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Version affected
- Potential impact

### Response timeline

| Action | Target |
|--------|--------|
| Acknowledge report | 48 hours |
| Assess severity | 7 days |
| Release fix | 30 days |
