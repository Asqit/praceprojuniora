import { genSalt, hash } from 'bcrypt'

async function genPassword(): Promise<string> {
  const salt = await genSalt(12)
  return await hash(process.argv[2], salt)
}

if (import.meta.main) {
  ;(async () => {
    console.log(await genPassword())
  })()
}
