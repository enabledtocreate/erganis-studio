import { app, BrowserWindow, shell } from 'electron';
import { spawn, type ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';
import getPort from 'get-port';

const DEV_URL = 'http://localhost:3000';
const isDev = process.env.STUDIO_DEV === 'true';

let mainWindow: BrowserWindow | null = null;
let nextProcess: ChildProcess | null = null;

function standaloneDir(): string {
  if (isDev) {
    return '';
  }
  return path.join(process.resourcesPath, 'standalone');
}

async function waitForUrl(url: string, attempts = 60): Promise<void> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function resolveServerEntry(dir: string): string {
  const candidates = [
    path.join(dir, 'server.js'),
    path.join(dir, 'apps/studio/server.js'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(`server.js not found under ${dir}`);
}

async function startEmbeddedServer(): Promise<string> {
  const dir = standaloneDir();
  const serverPath = resolveServerEntry(dir);
  const serverCwd = path.dirname(serverPath);
  const port = await getPort({ port: Number(process.env.STUDIO_WEB_PORT ?? 3310) });

  nextProcess = spawn(process.execPath, [serverPath], {
    cwd: serverCwd,
    env: {
      ...process.env,
      PORT: String(port),
      HOSTNAME: '127.0.0.1',
    },
    stdio: 'inherit',
  });

  const url = `http://127.0.0.1:${port}`;
  await waitForUrl(url);
  return url;
}

async function resolveAppUrl(): Promise<string> {
  if (isDev) {
    await waitForUrl(DEV_URL);
    return DEV_URL;
  }
  return startEmbeddedServer();
}

function createWindow(url: string): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'Erganis Studio',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(url);

  mainWindow.webContents.setWindowOpenHandler(({ url: target }) => {
    void shell.openExternal(target);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    const url = await resolveAppUrl();
    createWindow(url);
  } catch (error) {
    console.error('Failed to start Studio:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void resolveAppUrl().then(createWindow);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (nextProcess) {
    nextProcess.kill();
    nextProcess = null;
  }
});
