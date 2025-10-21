'use client'

import { useFormStatus } from 'react-dom'
import { useActionState, useEffect, useState } from 'react'
import { submitLead, initialLeadState, type LeadFormState } from '@/app/actions/createLead'

type LeadCaptureFormProps = {
  defaultService?: string
  pagePath?: string
  businessName?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="bg-brand rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? 'Submitting…' : 'Request quote'}
    </button>
  )
}

export default function LeadCaptureForm({ defaultService, pagePath, businessName }: LeadCaptureFormProps) {
  const [state, formAction] = useActionState<LeadFormState, FormData>(submitLead, initialLeadState)
  const [formReady, setFormReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFormReady(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="page" value={pagePath ?? ''} />
      {defaultService ? <input type="hidden" name="service" value={defaultService} /> : null}
      <input type="hidden" name="formReady" value={formReady ? 'yes' : ''} />
      <div className="sr-only" aria-hidden>
        <label htmlFor="lead-company">Company</label>
        <input id="lead-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="lead-name" className="text-sm font-medium text-muted">
          Name
        </label>
        <input
          id="lead-name"
          name="name"
          required
          placeholder="Jane Doe"
          className="rounded-xl border border-divider bg-surface px-3 py-2 text-sm outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
        />
        {state.fieldErrors?.name ? <p className="text-xs text-red-600">{state.fieldErrors.name}</p> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="lead-email" className="text-sm font-medium text-muted">
          Email
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="rounded-xl border border-divider bg-surface px-3 py-2 text-sm outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
        />
        {state.fieldErrors?.email ? <p className="text-xs text-red-600">{state.fieldErrors.email}</p> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="lead-phone" className="text-sm font-medium text-muted">
          Phone
        </label>
        <input
          id="lead-phone"
          name="phone"
          placeholder="(555) 123-4567"
          className="rounded-xl border border-divider bg-surface px-3 py-2 text-sm outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="lead-message" className="text-sm font-medium text-muted">
          How can we help?
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          placeholder={`Tell ${businessName ?? 'our team'} about your project`}
          className="rounded-xl border border-divider bg-surface px-3 py-2 text-sm outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
        />
      </div>

      {state.status === 'success' ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.message}</p>
      ) : null}
      {state.status === 'error' || state.status === 'disabled' ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
