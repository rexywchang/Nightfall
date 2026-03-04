import Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { gameState } from '../state/GameState';
import {
  ENEMY_SPAWN_DISTANCE, ENEMY_MAX_COUNT,
  SPAWN_INTERVAL_START, SPAWN_INTERVAL_MIN,
  SPAWN_BATCH_START, SPAWN_BATCH_MAX,
  DIFFICULTY_RAMP_INTERVAL,
} from '../config';

export class SpawnSystem {
  private scene: Phaser.Scene;
  private enemies: Phaser.Physics.Arcade.Group;
  private lastSpawn = 0;

  constructor(scene: Phaser.Scene, enemies: Phaser.Physics.Arcade.Group) {
    this.scene = scene;
    this.enemies = enemies;
  }

  private get difficultyTier(): number {
    return Math.floor(gameState.elapsedMs / DIFFICULTY_RAMP_INTERVAL);
  }

  get spawnInterval(): number {
    return Math.max(
      SPAWN_INTERVAL_MIN,
      SPAWN_INTERVAL_START - this.difficultyTier * 100,
    );
  }

  get batchSize(): number {
    return Math.min(SPAWN_BATCH_MAX, SPAWN_BATCH_START + Math.floor(this.difficultyTier * 0.5));
  }

  get hpMultiplier(): number {
    return 1 + this.difficultyTier * 0.3;
  }

  get speedMultiplier(): number {
    return 1 + this.difficultyTier * 0.05;
  }

  update(): void {
    const now = this.scene.time.now;
    if (now - this.lastSpawn < this.spawnInterval) return;
    this.lastSpawn = now;

    const activeCount = this.enemies.countActive(true);
    if (activeCount >= ENEMY_MAX_COUNT) return;

    const cam = this.scene.cameras.main;
    const cx = cam.scrollX + cam.width / 2;
    const cy = cam.scrollY + cam.height / 2;

    for (let i = 0; i < this.batchSize; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = ENEMY_SPAWN_DISTANCE + Math.random() * 100;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const enemy = this.enemies.get(x, y, 'enemy') as Enemy | null;
      if (enemy) {
        enemy.spawn(x, y, this.hpMultiplier, this.speedMultiplier);
      }
    }
  }
}
