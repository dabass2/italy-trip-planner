import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const BASE_PATH = '/italy-trip-planner/'

const config = defineConfig({
  // Served from a subpath; TanStack Start derives the router basepath and the
  // server function URL from this. Nitro needs it separately for static files.
  base: BASE_PATH,
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ baseURL: BASE_PATH, rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
