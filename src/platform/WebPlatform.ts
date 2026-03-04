import type { IPlatform } from './types';

declare global {
  function adBreak(opts: Record<string, unknown>): void;
}

export default class WebPlatform implements IPlatform {
  async init(): Promise<void> {
    // AdSense script is injected via Vite plugin at build time.
    // If it didn't load (local dev), that's fine — adBreak calls become no-ops.
  }

  gameLoadingStart(): void {}
  gameLoadingFinished(): void {}
  gameplayStart(): void {}
  gameplayStop(): void {}

  async showAd(type: 'interstitial' | 'rewarded'): Promise<boolean> {
    if (typeof adBreak !== 'function') return false;

    return new Promise<boolean>((resolve) => {
      adBreak({
        type: type === 'rewarded' ? 'reward' : 'next',
        beforeAd: () => {},
        afterAd: () => resolve(true),
        adBreakDone: (info: { breakStatus: string }) => {
          if (info.breakStatus !== 'viewed') resolve(false);
        },
      });
    });
  }

  happyMoment(): void {}
}
