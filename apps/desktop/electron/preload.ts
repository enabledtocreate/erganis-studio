import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('erganisStudio', {
  platform: process.platform,
  isDesktop: true,
  coreApiUrl: process.env.CORE_API_URL ?? 'http://localhost:5000',
});
