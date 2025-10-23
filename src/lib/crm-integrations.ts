/**
 * CRM Integrations
 *
 * Utilities for syncing leads to CRM systems
 */

export interface CRMConfig {
  provider: 'salesforce' | 'hubspot' | 'pipedrive' | 'zoho'
  apiKey?: string
  apiSecret?: string
  domain?: string
  accessToken?: string
}

export interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  message?: string
  source?: string
  customFields?: Record<string, any>
}

/**
 * Sync lead to Salesforce
 */
async function syncToSalesforce(config: CRMConfig, lead: LeadData): Promise<boolean> {
  try {
    if (!config.accessToken || !config.domain) {
      console.error('Salesforce: Missing access token or domain')
      return false
    }

    const response = await fetch(`${config.domain}/services/data/v57.0/sobjects/Lead`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirstName: lead.firstName,
        LastName: lead.lastName,
        Email: lead.email,
        Phone: lead.phone,
        Company: lead.company || 'Unknown',
        Description: lead.message,
        LeadSource: lead.source || 'Website',
        ...lead.customFields,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Salesforce sync failed:', error)
    return false
  }
}

/**
 * Sync lead to HubSpot
 */
async function syncToHubSpot(config: CRMConfig, lead: LeadData): Promise<boolean> {
  try {
    if (!config.apiKey) {
      console.error('HubSpot: Missing API key')
      return false
    }

    const properties = {
      firstname: lead.firstName,
      lastname: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      message: lead.message,
      hs_lead_status: 'NEW',
      ...lead.customFields,
    }

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    })

    return response.ok
  } catch (error) {
    console.error('HubSpot sync failed:', error)
    return false
  }
}

/**
 * Sync lead to CRM
 */
export async function syncLeadToCRM(config: CRMConfig, lead: LeadData): Promise<boolean> {
  switch (config.provider) {
    case 'salesforce':
      return syncToSalesforce(config, lead)
    case 'hubspot':
      return syncToHubSpot(config, lead)
    default:
      console.error(`CRM provider ${config.provider} not supported`)
      return false
  }
}
