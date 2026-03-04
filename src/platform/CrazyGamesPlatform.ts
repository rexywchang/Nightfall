import type { IPlatform } from './types';

declare global {
  interface Window {
    CrazyGames: {
      SDK: {
        init(): Promise<void>;
        ad: {
          requestAd(type: string, callbacks: Record<string, () => void>): void;
        };
        game: {
          gameplayStart(): void;
          gameplayStop(): void;
          happytime(): void;
          loadingStart(): void;
          loadingStop(): void;
        };
      };
    };
  }
}

export default class CrazyGamesPlatform implements IPlatform {
  private get sdk() {
    return window.CrazyGames.SDK;
  }

  async init(): Promise<void> {
    await this.sdk.init();
  }

  gameLoadingStart(): void {
    this.sdk.game.loadingStart();
  }

  gameLoadingFinished(): void {
    this.sdk.game.loadingStop();
  }

  gameplayStart(): void {
    this.sdk.game.gameplayStart();
  }

  gameplayStop(): void {
    this.sdk.game.gameplayStop();
  }

  async showAd(type: 'interstitial' | 'rewarded'): Promise<boolean> {
    const adType = type === 'rewarded' ? 'rewarded' : 'midgame';
    return new Promise<boolean>((resolve) => {
      this.sdk.ad.requestAd(adType, {
        adFinished: () => resolve(true),
        adError: () => resolve(false),
        adStarted: () => {},
      });
    });
  }

  happyMoment(): void {
    this.sdk.game.happytime();
  }
}
