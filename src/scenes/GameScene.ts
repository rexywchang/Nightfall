import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Bullet } from '../entities/Bullet';
import { XPOrb } from '../entities/XPOrb';
import { SpawnSystem } from '../systems/SpawnSystem';
import { WeaponSystem } from '../systems/WeaponSystem';
import { gameState } from '../state/GameState';
import { showDamageNumber } from '../utils/DamageNumber';
import { GAME_WIDTH, GAME_HEIGHT, XP_VALUE, COLOR_ENEMY } from '../config';

export class GameScene extends Phaser.Scene {
  player!: Player;
  enemies!: Phaser.Physics.Arcade.Group;
  bullets!: Phaser.Physics.Arcade.Group;
  xpOrbs!: Phaser.Physics.Arcade.Group;

  private spawnSystem!: SpawnSystem;
  private weaponSystem!: WeaponSystem;
  private bg!: Phaser.GameObjects.TileSprite;

  constructor() {
    super('Game');
  }

  create(): void {
    gameState.reset();

    // Background — large tileSprite centered on camera
    this.bg = this.add.tileSprite(0, 0, GAME_WIDTH * 3, GAME_HEIGHT * 3, 'bg_tile')
      .setOrigin(0.5)
      .setDepth(-1);

    // Player
    this.player = new Player(this, 0, 0);

    // Object pools
    this.enemies = this.physics.add.group({
      classType: Enemy,
      maxSize: 200,
      runChildUpdate: false,
    });

    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 100,
      runChildUpdate: false,
    });

    this.xpOrbs = this.physics.add.group({
      classType: XPOrb,
      maxSize: 200,
      runChildUpdate: false,
    });

    // Systems
    this.spawnSystem = new SpawnSystem(this, this.enemies);
    this.weaponSystem = new WeaponSystem(this, this.player, this.bullets, this.enemies);

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBackgroundColor(0x1a1a2e);

    // Collisions: bullets hit enemies
    this.physics.add.overlap(this.bullets, this.enemies, (bulletObj, enemyObj) => {
      const bullet = bulletObj as Bullet;
      const enemy = enemyObj as Enemy;
      if (!bullet.active || !enemy.active) return;

      bullet.deactivate();
      showDamageNumber(this, enemy.x, enemy.y, gameState.stats.damage);

      if (enemy.takeDamage(gameState.stats.damage)) {
        this.onEnemyKilled(enemy);
      }
    });

    // Collisions: enemies hit player
    this.physics.add.overlap(this.player, this.enemies, (_playerObj, enemyObj) => {
      const enemy = enemyObj as Enemy;
      if (!enemy.active) return;

      if (this.player.hitByEnemy()) {
        this.player.knockbackFrom(enemy.x, enemy.y);
        this.cameras.main.shake(100, 0.005);

        if (gameState.hp <= 0) {
          this.scene.stop('UI');
          this.scene.start('GameOver');
        }
      }
    });

    // Collisions: player picks up XP
    this.physics.add.overlap(this.player, this.xpOrbs, (_playerObj, orbObj) => {
      const orb = orbObj as XPOrb;
      if (!orb.active) return;

      orb.collect();
      if (gameState.addXp(XP_VALUE)) {
        this.onLevelUp();
      }
    });

    // Launch UI scene in parallel
    this.scene.launch('UI');
  }

  update(_time: number, delta: number): void {
    gameState.elapsedMs += delta;

    this.player.handleMovement();
    this.player.flashInvincible();

    // Move background with camera
    this.bg.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY);
    this.bg.setTilePosition(this.cameras.main.scrollX, this.cameras.main.scrollY);

    // Enemy AI: chase player
    this.enemies.getChildren().forEach((obj) => {
      const enemy = obj as Enemy;
      if (enemy.active) {
        enemy.chasePlayer(this.player.x, this.player.y);
      }
    });

    // XP magnet
    this.xpOrbs.getChildren().forEach((obj) => {
      const orb = obj as XPOrb;
      if (!orb.active) return;
      const dist = Phaser.Math.Distance.Between(orb.x, orb.y, this.player.x, this.player.y);
      if (dist < gameState.stats.magnetRange) {
        orb.magnetToward(this.player.x, this.player.y);
      }
    });

    // Systems
    this.spawnSystem.update();
    this.weaponSystem.update();
    this.weaponSystem.cleanupBullets();

    // Cull far-away enemies
    this.enemies.getChildren().forEach((obj) => {
      const enemy = obj as Enemy;
      if (!enemy.active) return;
      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      if (dist > 1200) {
        enemy.die();
      }
    });
  }

  private onEnemyKilled(enemy: Enemy): void {
    // Death particles
    const particles = this.add.particles(enemy.x, enemy.y, 'particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      lifespan: 300,
      quantity: 6,
      tint: COLOR_ENEMY,
      emitting: false,
    });
    particles.explode();
    this.time.delayedCall(400, () => particles.destroy());

    enemy.die();
    gameState.kills++;

    // Drop XP orb
    const orb = this.xpOrbs.get(enemy.x, enemy.y, 'xp_orb') as XPOrb | null;
    if (orb) {
      orb.spawn(enemy.x, enemy.y);
    }
  }

  private onLevelUp(): void {
    // Flash "Level Up!" text
    const text = this.add.text(this.player.x, this.player.y - 40, 'LEVEL UP!', {
      fontSize: '24px',
      color: '#f1c40f',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(200);

    this.tweens.add({
      targets: text,
      y: this.player.y - 80,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 800,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });

    // Pause game and show upgrade selection
    this.scene.pause('Game');
    this.scene.launch('LevelUp');
  }
}
