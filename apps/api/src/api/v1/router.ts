import listingRoutes from './routes/listing.routes'
import userRoutes from './routes/user.routes'
import scraperRoutes from './routes/scraper.routes'
import cvRoutes from './routes/cv.routes'
import statsRoutes from './routes/stats.routes'
import healthRoutes from './routes/health.routes'
import { Hono } from 'hono'

export const v1 = new Hono()
  .route('/listing', listingRoutes)
  .route('/auth', userRoutes)
  .route('/scraper', scraperRoutes)
  .route('/cv', cvRoutes)
  .route('/stats', statsRoutes)
  .route('/health', healthRoutes)

export type AppType = typeof v1
