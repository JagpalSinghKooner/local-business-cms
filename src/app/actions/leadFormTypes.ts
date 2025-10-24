/**
 * Lead Form Types and Constants
 * Separated from server actions to avoid "use server" restrictions
 */

export type LeadFormState = {
  status: 'idle' | 'success' | 'error' | 'validation-error' | 'disabled'
  message?: string
  fieldErrors?: Record<string, string>
}

export const initialLeadState: LeadFormState = { status: 'idle' }
