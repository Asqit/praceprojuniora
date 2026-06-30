import { stat } from 'node:fs'
import { join } from 'node:path'

const PATH = join(process.cwd(), 'ROADMAP_DELETE_ME_BEFORE_RELEASE.md')
stat(PATH, (err, stat) => {
  if (err !== null) {
    throw new Error('DEBÍLKU na někoho jsi zapoměl!')
  }

  console.clear()

  for (let i = 0; i < 120; i++) {
    if (i === 60) {
      console.warn('Nezapomeň mě smazat ty negře! FR FR')
      continue
    }

    console.log('=================================================')
  }
})
