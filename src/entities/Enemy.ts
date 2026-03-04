import Phaser from 'phaser';
import { ENEMY_SPEED, ENEMY_HP } from '../config';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  hp = ENEMY_HP;
  private baseSpeed = ENEMY_SPEED;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');
  }

  spawn(x: number, y: number, hpMultiplier: number, speedMultiplier: number): void {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.body!.enable = true;

    this.hp = Math.ceil(ENEMY_HP * hpMultiplier);
    this.baseSpeed = ENEMY_SPEED * speedMultiplier;
    this.clearTint();
    this.setAlpha(1);
  }

  chasePlayer(playerX: number, playerY: number): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);
    this.setVelocity(
      Math.cos(angle) * this.baseSpeed,
      Math.sin(angle) * this.baseSpeed,
    );
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;

    // Flash white on hit
    this.setTint(0xffffff);
    this.scene.time.delayedCall(60, () => {
      if (this.active) this.clearTint();
    });

    return this.hp <= 0;
  }

  die(): void {
    this.setActive(false);
    this.setVisible(false);
    this.body!.enable = false;
    this.setVelocity(0, 0);
  }
}
