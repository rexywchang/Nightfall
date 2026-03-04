/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM: 'web' | 'crazygames' | 'poki' | 'gd';
  readonly VITE_ADSENSE_PUB_ID: string;
  readonly VITE_GD_GAME_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
