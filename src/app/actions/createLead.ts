'use server'

import { z } from 'zod'
import { writeClient } from '@/sanity/writeClient'

const leadSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
  page: z.string().optional(),
})

export type LeadFormState = {
  status: 'idle' | 'success' | 'error' | 'validation-error' | 'disabled'
  message?: string
  fieldErrors?: Record<string, string>
}

export const initialLeadState: LeadFormState = { status: 'idle' }

export async function submitLead(_: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get('name')?.toString(),
    email: formData.get('email')?.toString(),
    phone: formData.get('phone')?.toString() || undefined,
    service: formData.get('service')?.toString() || undefined,
    message: formData.get('message')?.toString() || undefined,
    page: formData.get('page')?.toString() || undefined,
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      if (issue.path.length) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
    }
    return { status: 'validation-error', fieldErrors }
  }

  if (!writeClient) {
    return {
      status: 'disabled',
      message: 'Lead capture is not configured. Add SANITY_API_WRITE_TOKEN to enable submissions.',
    }
  }

  try {
    const { name, email, phone, service, message, page } = parsed.data
    await writeClient.create({
      _type: 'lead',
      name,
      email,
      phone,
      service,
      message,
      page,
      createdAt: new Date().toISOString(),
      status: 'new',
    })

    return { status: 'success', message: 'Thanks! We will contact you shortly.' }
  } catch (error) {
    console.error('Failed to create lead', error)
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or call us directly.',
    }
  }
}
