import type { VitePWAOptions } from 'vite-plugin-pwa'

const PWAConfig: Partial<VitePWAOptions> = {
  injectRegister: 'auto',
  workbox: {
    maximumFileSizeToCacheInBytes: 10000000
  },
  registerType: 'prompt',
  includeAssets: [
    'favicon.ico',
    'apple-touch-icon-180x180.png',
    'maskable-icon-512x512.svg',
    'pwa-64x64.png',
    'pwa-192x192.png',
    'pwa-512x512.png',
    'raisplus_screenshot.png',
    'raisplus_screenshot_mobile.png'
  ],
  manifest: {
    name: 'Dyslexia app',
    short_name: 'Dyslexia app',
    description: 'A gridnote for people who are struggling with writing',
    theme_color: '#0072BC',
    screenshots: [
      {
        src: 'app_screenshot.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Registration screen'
      },
      {
        src: 'app_screenshot_mobile.png',
        sizes: '1082x2402',
        type: 'image/png',
        label: 'Registration screen on moblie'
      }
    ],
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png'
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  },
  devOptions: {
    enabled: process.env.IS_BUILD !== 'TRUE',
    type: 'module'
  }
}

export default PWAConfig
