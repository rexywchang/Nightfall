import Phaser from 'phaser';
import { getRandomUpgrades, Upgrade } from '../systems/UpgradeSystem';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { gameState } from '../state/GameState';
import { getPlatform } from '../platform';

const AD_EVERY_N_LEVELS = 5;

export class LevelUpScene extends Phaser.Scene {
  constructor() {
    super('LevelUp');
  }

  create(): void {
    const shouldShowAd = gameState.level % AD_EVERY_N_LEVELS === 0;

    if (shouldShowAd) {
      getPlatform().showAd('interstitial').then(() => {
        this.showUpgradeUI();
      });
    } else {
      this.showUpgradeUI();
    }
  }

  private showUpgradeUI(): void {
    const upgrades = getRandomUpgrades(3);

    // Dim overlay
    this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x000000, 0.6,
    );

    // Title
    this.add.text(GAME_WIDTH / 2, 100, 'CHOOSE AN UPGRADE', {
      fontSize: '28px',
      color: '#f1c40f',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Cards
    const cardWidth = 180;
    const cardHeight = 160;
    const gap = 30;
    const totalWidth = upgrades.length * cardWidth + (upgrades.length - 1) * gap;
    const startX = (GAME_WIDTH - totalWidth) / 2 + cardWidth / 2;

    upgrades.forEach((upgrade, i) => {
      const x = startX + i * (cardWidth + gap);
      const y = GAME_HEIGHT / 2;

      this.createCard(x, y, cardWidth, cardHeight, upgrade);
    });
  }

  private createCard(x: number, y: number, w: number, h: number, upgrade: Upgrade): void {
    // Card background
    const card = this.add.rectangle(x, y, w, h, 0x2c3e50, 0.95)
      .setStrokeStyle(2, 0xf1c40f)
      .setInteractive({ useHandCursor: true });

    // Name
    this.add.text(x, y - 30, upgrade.name, {
      fontSize: '20px',
      color: '#f1c40f',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Description
    this.add.text(x, y + 15, upgrade.description, {
      fontSize: '14px',
      color: '#ecf0f1',
      wordWrap: { width: w - 20 },
      align: 'center',
    }).setOrigin(0.5);

    // Hover effect
    card.on('pointerover', () => {
      card.setFillStyle(0x34495e, 1);
      card.setScale(1.05);
    });
    card.on('pointerout', () => {
      card.setFillStyle(0x2c3e50, 0.95);
      card.setScale(1);
    });

    // Click to select
    card.on('pointerdown', () => {
      upgrade.apply();
      this.scene.stop('LevelUp');
      this.scene.resume('Game');
    });
  }
}
