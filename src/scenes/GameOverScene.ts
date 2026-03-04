import Phaser from 'phaser';
import { gameState } from '../state/GameState';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { getPlatform } from '../platform';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(): void {
    const platform = getPlatform();
    platform.gameplayStop();

    this.cameras.main.setBackgroundColor(0x000000);

    // Title
    this.add.text(GAME_WIDTH / 2, 120, 'GAME OVER', {
      fontSize: '48px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stats
    const secs = Math.floor(gameState.elapsedMs / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;

    const stats = [
      `Level: ${gameState.level}`,
      `Kills: ${gameState.kills}`,
      `Survived: ${m}:${s.toString().padStart(2, '0')}`,
    ];

    stats.forEach((line, i) => {
      this.add.text(GAME_WIDTH / 2, 220 + i * 36, line, {
        fontSize: '22px',
        color: '#ecf0f1',
      }).setOrigin(0.5);
    });

    // Restart button
    const btn = this.add.rectangle(GAME_WIDTH / 2, 400, 200, 50, 0x2ecc71, 1)
      .setInteractive({ useHandCursor: true });

    this.add.text(GAME_WIDTH / 2, 400, 'PLAY AGAIN', {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setFillStyle(0x27ae60));
    btn.on('pointerout', () => btn.setFillStyle(0x2ecc71));

    btn.on('pointerdown', () => {
      btn.disableInteractive();
      platform.showAd('interstitial').then(() => {
        platform.gameplayStart();
        this.scene.start('Game');
      });
    });
  }
}
