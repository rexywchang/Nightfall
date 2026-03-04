import { defineConfig, type Plugin } from 'vite';

const platform = process.env.VITE_PLATFORM || 'web';

/** Inject platform-specific SDK script tags into index.html */
function platformSdkPlugin(): Plugin {
  const sdkSnippets: Record<string, string> = {
    web: process.env.VITE_ADSENSE_PUB_ID
      ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.VITE_ADSENSE_PUB_ID}" crossorigin="anonymous"></script>
<script>window.adBreak=window.adBreak||function(o){(window.adsbygoogle=window.adsbygoogle||[]).push(o)};</script>`
      : '',
    crazygames:
      `<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>`,
    poki:
      `<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>`,
    gd:
      `<script src="https://html5.api.gamedistribution.com/main.min.js"></script>`,
  };

  return {
    name: 'platform-sdk',
    transformIndexHtml(html) {
      const snippet = sdkSnippets[platform] || '';
      if (!snippet) return html;
      return html.replace('</head>', `${snippet}\n</head>`);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [platformSdkPlugin()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: `dist/${platform}`,
    assetsInlineLimit: 0,
  },
});
