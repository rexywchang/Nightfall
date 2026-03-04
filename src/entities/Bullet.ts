import Phaser from 'phaser';
import { BULLET_LIFESPAN } from '../config';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  private spawnTime = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet');
  }

  fire(fromX: number, fromY: number, toX: number, toY: number, speed: number): void {
    this.setPosition(fromX, fromY);
    this.setActive(true);
    this.setVisible(true);
    this.body!.enable = true;

    const angle = Phaser.Math.Angle.Between(fromX, fromY, toX, toY);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.spawnTime = this.scene.time.now;
  }

  isExpired(): boolean {
    return this.scene.time.now - this.spawnTime > BULLET_LIFESPAN;
  }

  deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    this.body!.enable = false;
    this.setVelocity(0, 0);
  }
}
