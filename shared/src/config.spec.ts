import { resolveStudioConfig } from './core-client';

describe('resolveStudioConfig', () => {
  it('defaults to local Core and demo org', () => {
    const config = resolveStudioConfig({});
    expect(config.coreApiUrl).toBe('http://localhost:5000');
    expect(config.defaultOrgSlug).toBe('demo');
  });

  it('reads env overrides', () => {
    const config = resolveStudioConfig({
      NEXT_PUBLIC_CORE_API_URL: 'https://api.example.com',
      NEXT_PUBLIC_DEFAULT_ORG_SLUG: 'acme',
    });
    expect(config.coreApiUrl).toBe('https://api.example.com');
    expect(config.defaultOrgSlug).toBe('acme');
  });
});
