import path from 'path'
import { fileURLToPath } from 'url'
import type { Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Load only `.env` (and optional `.env.local`).
 * Skips `.env.development`, `.env.production`, etc.
 */
function loadDotEnvOnly(root: string): Record<string, string> {
  return loadEnv('_only', root, '')
}

/** Inject VITE_* from `.env` only into import.meta.env */
function onlyDotEnvPlugin(root: string): Plugin {
  const env = loadDotEnvOnly(root)

  return {
    name: 'only-dot-env',
    config() {
      const define = Object.fromEntries(
        Object.entries(env)
          .filter(([key]) => key.startsWith('VITE_'))
          .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
      )

      return { define }
    },
  }
}

function getProxyTarget(env: Record<string, string>): string {
  const explicit = env.VITE_API_PROXY_TARGET?.trim()
  if (explicit) {
    return explicit.replace(/\/$/, '')
  }

  const fromApiBase = env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '').trim()
  if (fromApiBase?.startsWith('http')) {
    return fromApiBase
  }

  return 'http://localhost:3000'
}

export default defineConfig(() => {
  const root = process.cwd()
  const env = loadDotEnvOnly(root)
  const proxyTarget = getProxyTarget(env)
  const bypassHeaders = env.VITE_VERCEL_PROTECTION_BYPASS
    ? { 'x-vercel-protection-bypass': env.VITE_VERCEL_PROTECTION_BYPASS }
    : undefined

  return {
    plugins: [onlyDotEnvPlugin(root), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          headers: bypassHeaders,
        },
        '/uploads': {
          target: proxyTarget,
          changeOrigin: true,
          headers: bypassHeaders,
        },
      },
    },
  }
})
