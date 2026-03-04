import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';
import { LevelUpScene } from './scenes/LevelUpScene';
import { GameOverScene } from './scenes/GameOverScene';
import { GAME_WIDTH, GAME_HEIGHT } from './config';

new Phaser.Game({
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: document.body,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, GameScene, UIScene, LevelUpScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});
