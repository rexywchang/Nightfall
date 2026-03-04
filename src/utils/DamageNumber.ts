import Phaser from 'phaser';
import { COLOR_DAMAGE_TEXT } from '../config';

export function showDamageNumber(scene: Phaser.Scene, x: number, y: number, amount: number): void {
  const text = scene.add.text(x, y - 10, `-${amount}`, {
    fontSize: '14px',
    color: Phaser.Display.Color.IntegerToColor(COLOR_DAMAGE_TEXT).rgba,
    fontStyle: 'bold',
  }).setOrigin(0.5).setDepth(100);

  scene.tweens.add({
    targets: text,
    y: y - 40,
    alpha: 0,
    duration: 600,
    ease: 'Power2',
    onComplete: () => text.destroy(),
  });
}
