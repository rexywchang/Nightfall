import Phaser from 'phaser';
import { gameState } from '../state/GameState';
import { PLAYER_INVINCIBLE_MS, PLAYER_KNOCKBACK, ENEMY_DAMAGE } from '../config';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private invincibleUntil = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(this.width / 2);
    this.setDepth(10);

    const kb = scene.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  get isInvincible(): boolean {
    return this.scene.time.now < this.invincibleUntil;
  }

  handleMovement(): void {
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

    // Normalize diagonal movement
    const len = Math.sqrt(vx * vx + vy * vy);
    if (len > 0) {
      vx /= len;
      vy /= len;
    }

    const speed = gameState.stats.speed;
    this.setVelocity(vx * speed, vy * speed);
  }

  hitByEnemy(): boolean {
    if (this.isInvincible) return false;

    this.invincibleUntil = this.scene.time.now + PLAYER_INVINCIBLE_MS;
    const died = gameState.takeDamage(ENEMY_DAMAGE);

    // Flash red
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });

    return died;
  }

  knockbackFrom(enemyX: number, enemyY: number): void {
    const angle = Phaser.Math.Angle.Between(enemyX, enemyY, this.x, this.y);
    this.setVelocity(
      Math.cos(angle) * PLAYER_KNOCKBACK,
      Math.sin(angle) * PLAYER_KNOCKBACK,
    );
  }

  flashInvincible(): void {
    if (this.isInvincible) {
      this.setAlpha(Math.sin(this.scene.time.now * 0.02) > 0 ? 1 : 0.3);
    } else {
      this.setAlpha(1);
    }
  }
}
