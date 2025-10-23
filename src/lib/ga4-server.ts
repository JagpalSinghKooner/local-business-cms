/**
 * Google Analytics 4 Server-Side Tracking
 *
 * Send events to GA4 from the server
 */

export interface GA4Event {
  name: string
  params?: Record<string, any>
}

export interface GA4Config {
  measurementId: string
  apiSecret: string
  clientId?: string
  userId?: string
  sessionId?: string
}

/**
 * Send event to GA4 Measurement Protocol
 */
export async function sendGA4Event(
  config: GA4Config,
  events: GA4Event | GA4Event[]
): Promise<boolean> {
  const { measurementId, apiSecret, clientId, userId, sessionId } = config

  if (!measurementId || !apiSecret) {
    console.warn('GA4 measurement ID or API secret not configured')
    return false
  }

  try {
    const eventsArray = Array.isArray(events) ? events : [events]

    const payload = {
      client_id: clientId || 'server-side',
      user_id: userId,
      timestamp_micros: Date.now() * 1000,
      non_personalized_ads: false,
      events: eventsArray.map((event) => ({
        name: event.name,
        params: {
          ...event.params,
          session_id: sessionId,
          engagement_time_msec: '100',
        },
      })),
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('GA4 tracking failed:', response.status, response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to send GA4 event:', error)
    return false
  }
}

/**
 * Track content view
 */
export async function trackContentView(
  config: GA4Config,
  params: {
    contentType: string
    contentId: string
    contentTitle: string
    contentCategory?: string
  }
): Promise<boolean> {
  return sendGA4Event(config, {
    name: 'view_item',
    params: {
      item_id: params.contentId,
      item_name: params.contentTitle,
      item_category: params.contentType,
      item_category2: params.contentCategory,
    },
  })
}

/**
 * Track form submission
 */
export async function trackFormSubmission(
  config: GA4Config,
  params: {
    formName: string
    formId: string
    formType: string
  }
): Promise<boolean> {
  return sendGA4Event(config, {
    name: 'generate_lead',
    params: {
      form_name: params.formName,
      form_id: params.formId,
      form_type: params.formType,
    },
  })
}

/**
 * Track content change
 */
export async function trackContentChange(
  config: GA4Config,
  params: {
    action: string
    documentType: string
    documentId: string
    userId?: string
  }
): Promise<boolean> {
  return sendGA4Event(config, {
    name: 'content_change',
    params: {
      action: params.action,
      document_type: params.documentType,
      document_id: params.documentId,
      user_id: params.userId,
    },
  })
}

/**
 * Track search
 */
export async function trackSearch(
  config: GA4Config,
  params: {
    searchTerm: string
    resultCount?: number
  }
): Promise<boolean> {
  return sendGA4Event(config, {
    name: 'search',
    params: {
      search_term: params.searchTerm,
      search_result_count: params.resultCount,
    },
  })
}

/**
 * Track page view
 */
export async function trackPageView(
  config: GA4Config,
  params: {
    pageLocation: string
    pageTitle: string
    pageReferrer?: string
  }
): Promise<boolean> {
  return sendGA4Event(config, {
    name: 'page_view',
    params: {
      page_location: params.pageLocation,
      page_title: params.pageTitle,
      page_referrer: params.pageReferrer,
    },
  })
}

/**
 * Track custom event
 */
export async function trackCustomEvent(
  config: GA4Config,
  eventName: string,
  params?: Record<string, any>
): Promise<boolean> {
  return sendGA4Event(config, {
    name: eventName,
    params,
  })
}
