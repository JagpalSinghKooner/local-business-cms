/**
 * Email Marketing Integrations
 *
 * Utilities for syncing contacts to email marketing platforms
 */

export interface EmailMarketingConfig {
  provider: 'mailchimp' | 'sendgrid' | 'klaviyo'
  apiKey: string
  listId?: string
  audienceId?: string
}

export interface ContactData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  tags?: string[]
  customFields?: Record<string, any>
}

/**
 * Sync contact to Mailchimp
 */
async function syncToMailchimp(
  config: EmailMarketingConfig,
  contact: ContactData
): Promise<boolean> {
  try {
    if (!config.apiKey || !config.audienceId) {
      console.error('Mailchimp: Missing API key or audience ID')
      return false
    }

    const datacenter = config.apiKey.split('-')[1]
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${config.audienceId}/members`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: contact.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName,
          LNAME: contact.lastName,
          PHONE: contact.phone,
        },
        tags: contact.tags,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Mailchimp sync failed:', error)
    return false
  }
}

/**
 * Sync contact to email marketing platform
 */
export async function syncContactToEmailMarketing(
  config: EmailMarketingConfig,
  contact: ContactData
): Promise<boolean> {
  switch (config.provider) {
    case 'mailchimp':
      return syncToMailchimp(config, contact)
    default:
      console.error(`Email marketing provider ${config.provider} not supported`)
      return false
  }
}
