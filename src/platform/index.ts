import type { IPlatform } from './types';

let instance: IPlatform | null = null;

export async function initPlatform(): Promise<void> {
  const id = import.meta.env.VITE_PLATFORM || 'web';

  const mod = await ({
    web: () => import('./WebPlatform'),
    crazygames: () => import('./CrazyGamesPlatform'),
    poki: () => import('./PokiPlatform'),
    gd: () => import('./GDPlatform'),
  }[id] ?? (() => import('./WebPlatform')))();

  instance = new mod.default();
  await instance.init();
}

export function getPlatform(): IPlatform {
  if (!instance) throw new Error('Platform not initialized — call initPlatform() first');
  return instance;
}
