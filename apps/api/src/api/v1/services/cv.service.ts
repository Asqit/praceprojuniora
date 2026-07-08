import { signPayload } from '@ppj/cv-auth'
import { enqueueJob } from '../../../utils/pdf-queue'

export class CvService {
  static async createPdfJob(data: any): Promise<string> {
    const payload = {
      exp: Date.now() + 60_000,
      data,
    }
    const jobToken = signPayload(payload)
    await enqueueJob(jobToken)

    return jobToken
  }
}
