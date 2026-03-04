export interface IPlatform {
  init(): Promise<void>;
  gameLoadingStart(): void;
  gameLoadingFinished(): void;
  gameplayStart(): void;
  gameplayStop(): void;
  showAd(type: 'interstitial' | 'rewarded'): Promise<boolean>;
  happyMoment(): void;
}
