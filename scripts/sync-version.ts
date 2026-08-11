const version = (await Bun.file('package.json').json()).version

const core = ['apps/api/package.json', 'apps/web/package.json']
const glob = new Bun.Glob('packages/*/package.json')
const packages = [...glob.scanSync('.')]

for (const path of [...core, ...packages]) {
  const pkg = await Bun.file(path).json()
  pkg.version = version
  await Bun.write(path, JSON.stringify(pkg, null, 2) + '\n')
}

console.log(`✓ bumped ${core.length + packages.length} packages → v${version}`)
