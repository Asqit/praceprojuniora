import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import {
  bulkJson,
  clickCounterParam,
  getAllQuery,
  voteParam,
  voteBody,
} from '../validators/listing.validators'
import { ListingService } from '../services/listing.service'
import { HTTPException } from 'hono/http-exception'

const router = new Hono()
  // ----------------------------------- GET ALL LISTINGS
  .get('/', zValidator('query', getAllQuery), async (c) => {
    const { page, limit, sortBy, search, location } = c.req.valid('query')
    const result = await ListingService.getAll({ page, limit, sortBy, search, location })
    return c.json(result)
  })
  // ----------------------------------- BULK
  .post('/bulk', zValidator('json', bulkJson), async (c) => {
    const { ids } = c.req.valid('json')
    const rows = await ListingService.bulkGet(ids)
    return c.json({ data: rows })
  })
  // ----------------------------------- CLICK
  .post('/click-counter/:id', zValidator('param', clickCounterParam), async (c) => {
    const { id } = c.req.valid('param')
    const updated = await ListingService.incrementClick(id)

    if (!updated) {
      throw new HTTPException(404, { message: 'not found!' })
    }

    return c.json(updated)
  })
  // ----------------------------------- VOTE
  .post('/vote/:id', zValidator('param', voteParam), zValidator('json', voteBody), async (c) => {
    const { id } = c.req.valid('param')
    const { direction } = c.req.valid('json')
    const updated = await ListingService.vote(id, direction)

    if (!updated) {
      throw new HTTPException(404, { message: 'not found!' })
    }

    return c.json(updated)
  })
  // ----------------------------------- GET RSS FEED
  .get('/rss', async (c) => {
    const rows = await ListingService.fetchLatestRssItems()
    const rss = ListingService.buildRssXml(rows)

    c.res.headers.set('Content-Type', 'application/rss+xml; charset=utf-8')
    const lastModified = ListingService.getRssLastModified(rows)
    if (lastModified) c.res.headers.set('Last-Modified', lastModified)
    c.res.headers.set('Cache-Control', 'public, max-age=300')

    return c.text(rss, 200)
  })

export default router
