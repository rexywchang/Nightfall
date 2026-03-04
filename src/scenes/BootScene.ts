import Phaser from 'phaser';
import { generateTextures } from '../utils/TextureGenerator';
import { getPlatform } from '../platform';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    generateTextures(this);

    const platform = getPlatform();
    platform.gameLoadingFinished();

    // Preroll ad, then start gameplay
    platform.showAd('interstitial').then(() => {
      platform.gameplayStart();
      this.scene.start('Game');
    });
  }
}
