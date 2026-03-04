import type { IPlatform } from './types';

declare global {
  interface Window {
    PokiSDK: {
      init(): Promise<void>;
      gameLoadingStart(): void;
      gameLoadingFinished(): void;
      gameplayStart(): void;
      gameplayStop(): void;
      commercialBreak(): Promise<void>;
      rewardedBreak(): Promise<boolean>;
      happyTime(intensity: number): void;
    };
  }
}

export default class PokiPlatform implements IPlatform {
  private get sdk() {
    return window.PokiSDK;
  }

  async init(): Promise<void> {
    await this.sdk.init();
  }

  gameLoadingStart(): void {
    this.sdk.gameLoadingStart();
  }

  gameLoadingFinished(): void {
    this.sdk.gameLoadingFinished();
  }

  gameplayStart(): void {
    this.sdk.gameplayStart();
  }

  gameplayStop(): void {
    this.sdk.gameplayStop();
  }

  async showAd(type: 'interstitial' | 'rewarded'): Promise<boolean> {
    try {
      if (type === 'rewarded') {
        return await this.sdk.rewardedBreak();
      }
      await this.sdk.commercialBreak();
      return true;
    } catch {
      return false;
    }
  }

  happyMoment(): void {
    this.sdk.happyTime(1);
  }
}
