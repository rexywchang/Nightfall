import { gameState } from '../state/GameState';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  apply: () => void;
}

const allUpgrades: Upgrade[] = [
  {
    id: 'damage',
    name: 'ATK Up',
    description: 'Damage +1',
    apply: () => { gameState.stats.damage += 1; },
  },
  {
    id: 'speed',
    name: 'Speed Up',
    description: 'Move speed +15%',
    apply: () => { gameState.stats.speed *= 1.15; },
  },
  {
    id: 'fire_rate',
    name: 'Fire Rate',
    description: 'Attack speed +20%',
    apply: () => { gameState.stats.fireRate = Math.max(100, gameState.stats.fireRate * 0.8); },
  },
  {
    id: 'max_hp',
    name: 'Max HP',
    description: 'Max HP +25, heal 25',
    apply: () => {
      gameState.stats.maxHp += 25;
      gameState.heal(25);
    },
  },
  {
    id: 'magnet',
    name: 'Magnet',
    description: 'XP pickup range +40%',
    apply: () => { gameState.stats.magnetRange *= 1.4; },
  },
  {
    id: 'bullet_speed',
    name: 'Bullet Speed',
    description: 'Projectile speed +25%',
    apply: () => { gameState.stats.bulletSpeed *= 1.25; },
  },
];

export function getRandomUpgrades(count: number): Upgrade[] {
  const shuffled = [...allUpgrades].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
