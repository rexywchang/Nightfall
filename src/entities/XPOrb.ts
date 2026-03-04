import Phaser from 'phaser';
import { XP_MAGNET_SPEED } from '../config';

export class XPOrb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'xp_orb');
  }

  spawn(x: number, y: number): void {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.body!.enable = true;
    this.setVelocity(0, 0);
  }

  magnetToward(targetX: number, targetY: number): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    this.setVelocity(
      Math.cos(angle) * XP_MAGNET_SPEED,
      Math.sin(angle) * XP_MAGNET_SPEED,
    );
  }

  collect(): void {
    this.setActive(false);
    this.setVisible(false);
    this.body!.enable = false;
    this.setVelocity(0, 0);
  }
}
