import {
  PLAYER_MAX_HP, PLAYER_SPEED, BULLET_DAMAGE, FIRE_RATE,
  BULLET_SPEED, XP_MAGNET_RANGE, BASE_XP_TO_LEVEL, XP_LEVEL_SCALE,
} from '../config';

export interface Stats {
  maxHp: number;
  speed: number;
  damage: number;
  fireRate: number;       // ms between shots (lower = faster)
  bulletSpeed: number;
  magnetRange: number;
}

class GameState {
  hp = PLAYER_MAX_HP;
  xp = 0;
  level = 1;
  kills = 0;
  elapsedMs = 0;

  stats: Stats = {
    maxHp: PLAYER_MAX_HP,
    speed: PLAYER_SPEED,
    damage: BULLET_DAMAGE,
    fireRate: FIRE_RATE,
    bulletSpeed: BULLET_SPEED,
    magnetRange: XP_MAGNET_RANGE,
  };

  get xpToNextLevel(): number {
    return Math.floor(BASE_XP_TO_LEVEL * Math.pow(XP_LEVEL_SCALE, this.level - 1));
  }

  addXp(amount: number): boolean {
    this.xp += amount;
    if (this.xp >= this.xpToNextLevel) {
      this.xp -= this.xpToNextLevel;
      this.level++;
      return true; // leveled up
    }
    return false;
  }

  takeDamage(amount: number): boolean {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp <= 0; // died
  }

  heal(amount: number): void {
    this.hp = Math.min(this.stats.maxHp, this.hp + amount);
  }

  reset(): void {
    this.hp = PLAYER_MAX_HP;
    this.xp = 0;
    this.level = 1;
    this.kills = 0;
    this.elapsedMs = 0;
    this.stats = {
      maxHp: PLAYER_MAX_HP,
      speed: PLAYER_SPEED,
      damage: BULLET_DAMAGE,
      fireRate: FIRE_RATE,
      bulletSpeed: BULLET_SPEED,
      magnetRange: XP_MAGNET_RANGE,
    };
  }
}

export const gameState = new GameState();
