import { normalize } from './normalize'
import { escapeRegExp } from './utils'

const TECHNOLOGIES = [
  'javascript',
  'typescript',
  'react',
  'react native',
  'next.js',
  'nextjs',
  'vue',
  'vue.js',
  'angular',
  'svelte',

  'html',
  'css',
  'tailwind',

  'node.js',
  'nodejs',
  'bun',
  'deno',

  'python',
  'django',
  'flask',
  'fastapi',

  'java',
  'spring',
  'kotlin',

  'c#',
  '.net',
  'dotnet',
  'c++',

  'php',
  'laravel',
  'symfony',

  'go',
  'golang',
  'rust',
  'ruby',
  'rails',

  'swift',
  'ios',
  'android',

  'sql',
  'postgresql',
  'postgres',
  'mysql',
  'mariadb',
  'mongodb',
  'redis',

  'docker',
  'kubernetes',

  'aws',
  'azure',
  'gcp',

  'terraform',
  'ansible',

  'git',
  'github',
  'gitlab',
]

export function extractTechnologies(text: string): string[] {
  const normalized = normalize(text)

  const found = new Set<string>()

  for (const technology of TECHNOLOGIES) {
    const normalizedTechnology = normalize(technology)

    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(normalizedTechnology)}(?![\\p{L}\\p{N}])`,
      'iu'
    )

    if (pattern.test(normalized)) {
      found.add(technology)
    }
  }

  return [...found]
}
