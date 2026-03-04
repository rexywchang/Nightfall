import Phaser from 'phaser';
import { gameState } from '../state/GameState';
import { GAME_WIDTH, COLOR_HP_BAR, COLOR_XP_BAR, COLOR_HP_BG } from '../config';

export class UIScene extends Phaser.Scene {
  private hpBarBg!: Phaser.GameObjects.Graphics;
  private hpBar!: Phaser.GameObjects.Graphics;
  private xpBar!: Phaser.GameObjects.Graphics;
  private levelText!: Phaser.GameObjects.Text;
  private killsText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;

  constructor() {
    super('UI');
  }

  create(): void {
    const barWidth = GAME_WIDTH - 40;
    const barY = 12;
    const barHeight = 14;

    // HP bar background
    this.hpBarBg = this.add.graphics();
    this.hpBar = this.add.graphics();

    // XP bar
    this.xpBar = this.add.graphics();

    // Text displays
    this.levelText = this.add.text(20, 52, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    this.killsText = this.add.text(GAME_WIDTH - 20, 52, '', {
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(1, 0);

    this.timerText = this.add.text(GAME_WIDTH / 2, 52, '', {
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5, 0);
  }

  update(): void {
    const barWidth = GAME_WIDTH - 40;
    const barHeight = 14;

    // HP bar
    const hpRatio = gameState.hp / gameState.stats.maxHp;
    this.hpBarBg.clear();
    this.hpBarBg.fillStyle(COLOR_HP_BG, 0.8);
    this.hpBarBg.fillRoundedRect(20, 12, barWidth, barHeight, 3);

    this.hpBar.clear();
    this.hpBar.fillStyle(COLOR_HP_BAR, 1);
    this.hpBar.fillRoundedRect(20, 12, barWidth * hpRatio, barHeight, 3);

    // XP bar
    const xpRatio = gameState.xp / gameState.xpToNextLevel;
    this.xpBar.clear();
    this.xpBar.fillStyle(COLOR_HP_BG, 0.8);
    this.xpBar.fillRoundedRect(20, 32, barWidth, 8, 2);
    this.xpBar.fillStyle(COLOR_XP_BAR, 1);
    this.xpBar.fillRoundedRect(20, 32, barWidth * xpRatio, 8, 2);

    // Text
    this.levelText.setText(`Lv.${gameState.level}`);
    this.killsText.setText(`Kills: ${gameState.kills}`);

    const secs = Math.floor(gameState.elapsedMs / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    this.timerText.setText(`${m}:${s.toString().padStart(2, '0')}`);
  }
}
