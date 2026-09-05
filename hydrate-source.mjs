import { gunzipSync } from 'node:zlib'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'

const root = process.cwd()
const bundledSource = resolve(root, '.deployment/source.b64')

if (existsSync(bundledSource)) {
  const files = JSON.parse(gunzipSync(Buffer.from(readFileSync(bundledSource, 'utf8'), 'base64')).toString('utf8'))
  for (const [relativePath, contents] of Object.entries(files)) {
    const destination = resolve(root, relativePath)
    if (relative(root, destination).startsWith('..')) throw new Error(`Unsafe bundled path: ${relativePath}`)
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, contents, 'utf8')
  }
}

const assetNames = [
  'community-courtyard.png',
  'handover-vehicle.png',
  'impact-city.png',
  'matching-route.png',
  'material-detail.png',
  'rebuilt-pavilion.png',
  'recovery-studio.png',
  'sunrise-material-yard.png',
]
const assetDirectory = resolve(root, 'public/assets')
for (const assetName of assetNames) {
  const uploadedAsset = resolve(root, assetName)
  const destination = resolve(assetDirectory, assetName)
  if (existsSync(uploadedAsset) && !existsSync(destination)) {
    mkdirSync(assetDirectory, { recursive: true })
    renameSync(uploadedAsset, destination)
  }
}
