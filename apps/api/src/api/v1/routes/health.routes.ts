import { Hono } from 'hono'
import { HealthService } from '../services/health.service'

const router = new Hono().get('/', async (c) => {
  const status = await HealthService.getHealthStatus()
  if (status.status !== 'ok') {
    return c.json(status, 503)
  }

  return c.json(status)
})

export default router
