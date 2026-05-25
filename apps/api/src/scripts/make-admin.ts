import { db } from '../db/connection.js'
import { users } from '../db/schema.js'
import { hash, genSalt } from 'bcrypt'

async function makeAdmin(): Promise<void> {
  // users table should have only 1 user
  const conflict = await db.select().from(users).limit(1)
  if (conflict.length) {
    console.error('user already exists!')
    process.exit(1)
  }

  const salt = await genSalt(12)
  const pwdPrint = await hash(process.argv[2], salt)

  const inserted = await db
    .insert(users)
    .values({
      password: pwdPrint,
      email: process.argv[3],
    })
    .returning()

  console.log(`user ${inserted[0].email} has been created!`)
}

if (import.meta.main) {
  makeAdmin()
}
