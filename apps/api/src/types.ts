import { validateEnvironment } from './utils/env'

// cloudflare workers ONLY!
export type HBindings = {}

export type HVariables = {
  userId: number
}

export type HTypes = {
  Bindings: HBindings
  Variables: HVariables
}
