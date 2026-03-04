import type { IPlatform } from './types';

declare global {
  interface Window {
    gdsdk: {
      showAd(type: string): Promise<{ adBreakDone: boolean }>;
    };
    GD_OPTIONS: Record<string, unknown>;
  }
}

export default class GDPlatform implements IPlatform {
  async init(): Promise<void> {
    // GD SDK initializes itself via the script tag + GD_OPTIONS.
    // Set up GD_OPTIONS before the script loads (handled by Vite plugin injecting early).
    window.GD_OPTIONS = {
      gameId: import.meta.env.VITE_GD_GAME_ID || '',
    };
  }

  gameLoadingStart(): void {}
  gameLoadingFinished(): void {}
  gameplayStart(): void {}
  gameplayStop(): void {}

  async showAd(type: 'interstitial' | 'rewarded'): Promise<boolean> {
    try {
      const adType = type === 'rewarded' ? 'rewarded' : 'interstitial';
      await window.gdsdk.showAd(adType);
      return true;
    } catch {
      return false;
    }
  }

  happyMoment(): void {}
}
