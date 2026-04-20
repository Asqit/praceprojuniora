import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function errorHandler() {
  return async function (error: Error, c: Context) {
    console.error(error)
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status)
    }
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
