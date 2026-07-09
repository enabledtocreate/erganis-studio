import { CoreApiClient } from '@erganis/studio-shared';
import { config } from './config';

export function createBrowserClient() {
  return new CoreApiClient(config.coreApiUrl, (input, init) => fetch(input, init));
}

export { config };
