'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { writeClient } from '@/sanity/writeClient'

const RATE_LIMIT_COOKIE = 'lead-last-submission'
const RATE_LIMIT_WINDOW_MS = 60 * 1000

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
  const honeypot = formData.get('company')?.toString() ?? ''
  if (honeypot.trim().length > 0) {
    return { status: 'success', message: 'Thanks! We will contact you shortly.' }
  }

  const formReady = formData.get('formReady')?.toString()
  if (formReady !== 'yes') {
    return {
      status: 'error',
      message: 'Please wait a moment before submitting the form.',
    }
  }

  const cookieStore = await cookies()
  const lastAttemptCookie = cookieStore.get(RATE_LIMIT_COOKIE)
  const lastAttemptValue = lastAttemptCookie?.value
  const lastAttempt = lastAttemptValue ? Number.parseInt(lastAttemptValue, 10) : NaN
  const now = Date.now()
  if (!Number.isNaN(lastAttempt) && now - lastAttempt < RATE_LIMIT_WINDOW_MS) {
    return {
      status: 'error',
      message: 'Please wait a moment before submitting another request.',
    }
  }

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

    cookieStore.set(RATE_LIMIT_COOKIE, String(now), {
      httpOnly: true,
      maxAge: 5 * 60,
      sameSite: 'lax',
      path: '/',
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
