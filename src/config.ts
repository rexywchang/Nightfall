// === Game Constants ===

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Player
export const PLAYER_SPEED = 200;
export const PLAYER_SIZE = 16;
export const PLAYER_MAX_HP = 100;
export const PLAYER_INVINCIBLE_MS = 500;
export const PLAYER_KNOCKBACK = 200;

// Enemies
export const ENEMY_SIZE = 14;
export const ENEMY_SPEED = 80;
export const ENEMY_HP = 3;
export const ENEMY_DAMAGE = 10;
export const ENEMY_SPAWN_DISTANCE = 500; // pixels outside camera
export const ENEMY_MAX_COUNT = 150;

// Spawning
export const SPAWN_INTERVAL_START = 1500; // ms
export const SPAWN_INTERVAL_MIN = 300;
export const SPAWN_BATCH_START = 1;
export const SPAWN_BATCH_MAX = 8;
export const DIFFICULTY_RAMP_INTERVAL = 15000; // ms — every 15s

// Bullets
export const BULLET_SPEED = 400;
export const BULLET_SIZE = 5;
export const BULLET_DAMAGE = 1;
export const BULLET_LIFESPAN = 2000; // ms
export const FIRE_RATE = 400; // ms between shots

// XP
export const XP_ORB_SIZE = 6;
export const XP_VALUE = 1;
export const XP_MAGNET_RANGE = 80;
export const XP_MAGNET_SPEED = 300;
export const BASE_XP_TO_LEVEL = 5;
export const XP_LEVEL_SCALE = 1.4;

// Colors
export const COLOR_BG = 0x1a1a2e;
export const COLOR_GRID = 0x16213e;
export const COLOR_PLAYER = 0x4fc3f7;
export const COLOR_ENEMY = 0xe74c3c;
export const COLOR_BULLET = 0xf1c40f;
export const COLOR_XP = 0x2ecc71;
export const COLOR_HP_BAR = 0xe74c3c;
export const COLOR_XP_BAR = 0x2ecc71;
export const COLOR_HP_BG = 0x333333;
export const COLOR_WHITE = 0xffffff;
export const COLOR_DAMAGE_TEXT = 0xffffff;
