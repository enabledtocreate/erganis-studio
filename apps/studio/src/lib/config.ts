import { resolveStudioConfig } from '@erganis/studio-shared';

export const config = resolveStudioConfig({
  NEXT_PUBLIC_CORE_API_URL: process.env.NEXT_PUBLIC_CORE_API_URL,
  NEXT_PUBLIC_DEFAULT_ORG_SLUG: process.env.NEXT_PUBLIC_DEFAULT_ORG_SLUG,
});
