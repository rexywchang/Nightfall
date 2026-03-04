import Phaser from 'phaser';
import {
  PLAYER_SIZE, ENEMY_SIZE, BULLET_SIZE, XP_ORB_SIZE,
  COLOR_PLAYER, COLOR_ENEMY, COLOR_BULLET, COLOR_XP, COLOR_BG, COLOR_GRID,
} from '../config';

export function generateTextures(scene: Phaser.Scene): void {
  // Player — blue circle
  const pg = scene.make.graphics({ x: 0, y: 0 }, false);
  pg.fillStyle(COLOR_PLAYER);
  pg.fillCircle(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE);
  pg.generateTexture('player', PLAYER_SIZE * 2, PLAYER_SIZE * 2);
  pg.destroy();

  // Enemy — red square
  const eg = scene.make.graphics({ x: 0, y: 0 }, false);
  eg.fillStyle(COLOR_ENEMY);
  eg.fillRect(0, 0, ENEMY_SIZE * 2, ENEMY_SIZE * 2);
  eg.generateTexture('enemy', ENEMY_SIZE * 2, ENEMY_SIZE * 2);
  eg.destroy();

  // Bullet — yellow circle
  const bg = scene.make.graphics({ x: 0, y: 0 }, false);
  bg.fillStyle(COLOR_BULLET);
  bg.fillCircle(BULLET_SIZE, BULLET_SIZE, BULLET_SIZE);
  bg.generateTexture('bullet', BULLET_SIZE * 2, BULLET_SIZE * 2);
  bg.destroy();

  // XP orb — green diamond
  const xg = scene.make.graphics({ x: 0, y: 0 }, false);
  xg.fillStyle(COLOR_XP);
  xg.fillPoints([
    new Phaser.Geom.Point(XP_ORB_SIZE, 0),
    new Phaser.Geom.Point(XP_ORB_SIZE * 2, XP_ORB_SIZE),
    new Phaser.Geom.Point(XP_ORB_SIZE, XP_ORB_SIZE * 2),
    new Phaser.Geom.Point(0, XP_ORB_SIZE),
  ], true);
  xg.generateTexture('xp_orb', XP_ORB_SIZE * 2, XP_ORB_SIZE * 2);
  xg.destroy();

  // Background tile — dark grid
  const tileSize = 64;
  const tg = scene.make.graphics({ x: 0, y: 0 }, false);
  tg.fillStyle(COLOR_BG);
  tg.fillRect(0, 0, tileSize, tileSize);
  tg.lineStyle(1, COLOR_GRID, 0.3);
  tg.strokeRect(0, 0, tileSize, tileSize);
  tg.generateTexture('bg_tile', tileSize, tileSize);
  tg.destroy();

  // White pixel for flash effects
  const wg = scene.make.graphics({ x: 0, y: 0 }, false);
  wg.fillStyle(0xffffff);
  wg.fillRect(0, 0, 4, 4);
  wg.generateTexture('white_pixel', 4, 4);
  wg.destroy();

  // Particle — small white circle
  const partG = scene.make.graphics({ x: 0, y: 0 }, false);
  partG.fillStyle(0xffffff);
  partG.fillCircle(3, 3, 3);
  partG.generateTexture('particle', 6, 6);
  partG.destroy();
}
