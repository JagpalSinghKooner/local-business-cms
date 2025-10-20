import Container from '@/components/layout/Container'
import { CtaButton } from '@/components/ui/CtaButton'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'
import type { PageSection, SiteSettings } from '@/types/sanity'

type ContactSectionProps = {
  section: Extract<PageSection, { _type: 'section.contact' }>
  site?: SiteSettings | null
  pagePath?: string
}

export default function ContactSection({ section, site, pagePath }: ContactSectionProps) {
  const leadsEnabled = Boolean(process.env.SANITY_API_WRITE_TOKEN)

  return (
    <section className="bg-white py-16">
      <Container className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Contact</p>
          <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2>
          {section.description ? <p className="text-base text-zinc-600">{section.description}</p> : null}
          <div className="space-y-2 text-sm text-zinc-500">
            {site?.phone ? (
              <p>
                <span className="font-semibold text-zinc-700">Phone:</span> {site.phone}
              </p>
            ) : null}
            {site?.email ? (
              <p>
                <span className="font-semibold text-zinc-700">Email:</span> {site.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm shadow-zinc-900/5">
          {section.formType === 'embed' && section.embedCode ? (
            <div dangerouslySetInnerHTML={{ __html: section.embedCode }} />
          ) : section.formType === 'external' && section.externalLink ? (
            <div className="space-y-4 text-sm">
              <p>Open our secure booking form to request service.</p>
              <CtaButton cta={{ href: section.externalLink, label: 'Open booking form', style: 'primary' }} />
            </div>
          ) : !leadsEnabled ? (
            <p className="text-sm text-zinc-600">
              Lead capture is not configured yet. Add <code className="rounded bg-zinc-200 px-1 py-0.5">SANITY_API_WRITE_TOKEN</code>{' '}
              to enable the inline form, or switch this section to an embedded/ external form.
            </p>
          ) : (
            <LeadCaptureForm
              defaultService={site?.name}
              pagePath={pagePath}
              businessName={site?.name}
            />
          )}
        </div>
      </Container>
    </section>
  )
}
