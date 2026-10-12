import { z } from 'zod'

export const CV_TEMPLATES = ['default', 'aurora', 'nebula', 'cyber'] as const
export type CvTemplate = (typeof CV_TEMPLATES)[number]

export const cvDetailsSchema = z.object({
  personal: z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    address: z.string(),
    email: z.string(),
    phone: z.string(),
    links: z.array(z.string()).optional(),
    summary: z.string().optional(),
  }),
  experiences: z.array(
    z.object({
      title: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string(),
    })
  ),
  education: z.array(
    z.object({
      title: z.string(),
      degree: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string(),
    })
  ),
  skills: z.record(z.string(), z.array(z.string())),
  languages: z.record(z.string(), z.string()),
})

export type CvDetails = z.infer<typeof cvDetailsSchema>

export function isCvTemplate(value: unknown): value is CvTemplate {
  return typeof value === 'string' && CV_TEMPLATES.includes(value as CvTemplate)
}
