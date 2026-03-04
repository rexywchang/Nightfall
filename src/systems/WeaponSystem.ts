import Phaser from 'phaser';
import { Bullet } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { gameState } from '../state/GameState';

export class WeaponSystem {
  private scene: Phaser.Scene;
  private bullets: Phaser.Physics.Arcade.Group;
  private enemies: Phaser.Physics.Arcade.Group;
  private player: Player;
  private lastFired = 0;

  constructor(
    scene: Phaser.Scene,
    player: Player,
    bullets: Phaser.Physics.Arcade.Group,
    enemies: Phaser.Physics.Arcade.Group,
  ) {
    this.scene = scene;
    this.player = player;
    this.bullets = bullets;
    this.enemies = enemies;
  }

  update(): void {
    const now = this.scene.time.now;
    if (now - this.lastFired < gameState.stats.fireRate) return;

    // Find nearest enemy
    let nearest: Enemy | null = null;
    let nearestDist = Infinity;

    this.enemies.getChildren().forEach((obj) => {
      const enemy = obj as Enemy;
      if (!enemy.active) return;
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, enemy.x, enemy.y,
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = enemy;
      }
    });

    if (!nearest || nearestDist > 600) return;

    this.lastFired = now;

    const bullet = this.bullets.get(this.player.x, this.player.y, 'bullet') as Bullet | null;
    if (bullet) {
      bullet.fire(
        this.player.x, this.player.y,
        (nearest as Enemy).x, (nearest as Enemy).y,
        gameState.stats.bulletSpeed,
      );
    }
  }

  cleanupBullets(): void {
    this.bullets.getChildren().forEach((obj) => {
      const bullet = obj as Bullet;
      if (bullet.active && bullet.isExpired()) {
        bullet.deactivate();
      }
    });
  }
}
