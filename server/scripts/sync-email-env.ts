/**
 * Copy email settings from volumeDayTraders/admin-server/.env → tradingSignals/server/.env
 * Run: npm run sync:email-env
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serverRoot = path.resolve(__dirname, '..')
const targetEnvPath = path.join(serverRoot, '.env')
const sourceEnvPath = path.resolve(
  serverRoot,
  '../../volumeDayTraders/admin-server/.env',
)

const EMAIL_KEYS = [
  'BREVO_API_KEY',
  'BREVO_SMTP_KEY',
  'BREVO_SENDER_EMAIL',
  'BREVO_SENDER_NAME',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'EMAIL_USE_GMAIL_FOR_DISPOSABLE',
] as const

function parseEnv(content: string): Map<string, string> {
  const map = new Map<string, string>()
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }
    const eq = trimmed.indexOf('=')
    if (eq === -1) {
      continue
    }
    map.set(trimmed.slice(0, eq).trim(), trimmed.slice(eq + 1))
  }
  return map
}

function upsertEnvLine(lines: string[], key: string, value: string): string[] {
  const pattern = new RegExp(`^${key}=`)
  let found = false
  const next = lines.map((line) => {
    if (pattern.test(line)) {
      found = true
      return `${key}=${value}`
    }
    return line
  })
  if (!found) {
    next.push(`${key}=${value}`)
  }
  return next
}

function main() {
  if (!fs.existsSync(sourceEnvPath)) {
    console.error('Source not found:', sourceEnvPath)
    process.exit(1)
  }

  const source = parseEnv(fs.readFileSync(sourceEnvPath, 'utf8'))
  let lines = fs.existsSync(targetEnvPath)
    ? fs.readFileSync(targetEnvPath, 'utf8').split(/\r?\n/)
    : []

  let copied = 0
  for (const key of EMAIL_KEYS) {
    const value = source.get(key)
    if (value && value.trim()) {
      lines = upsertEnvLine(lines, key, value)
      copied += 1
      console.log(`Copied ${key}`)
    }
  }

  const notifyKey = 'INQUIRY_NOTIFY_EMAIL'
  lines = upsertEnvLine(lines, notifyKey, 'tradingsignals@yopmail.com')
  console.log(`Set ${notifyKey}=tradingsignals@yopmail.com`)

  if (!fs.existsSync(targetEnvPath)) {
    lines.unshift('# Auto-created by sync:email-env')
  }

  fs.writeFileSync(targetEnvPath, `${lines.filter((line, i, arr) => line !== '' || i < arr.length - 1).join('\n')}\n`)
  console.log(`\nUpdated ${targetEnvPath} (${copied} email keys copied from volumeDayTraders)`)
  if (copied === 0) {
    console.warn(
      '\nNo Brevo/Gmail keys found in volumeDayTraders — add GMAIL_USER + GMAIL_APP_PASSWORD there or here.',
    )
    process.exit(1)
  }
}

main()
