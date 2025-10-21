import sanitizeHtml from 'sanitize-html'
import Container from '@/components/layout/Container'
import { CtaButton } from '@/components/ui/CtaButton'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'
import { resolveLink } from '@/lib/links'
import type { PageSection, SiteSettings } from '@/types'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'

type ContactSectionProps = {
  section: Extract<PageSection, { _type: 'section.contact' }>
  site?: SiteSettings | null
  pagePath?: string
}

export default function ContactSection({ section, site, pagePath }: ContactSectionProps) {
  const leadsEnabled = Boolean(process.env.SANITY_API_WRITE_TOKEN)
  const externalResolved = section.formType === 'external' ? resolveLink(section.externalLink) : null
  const sanitizedEmbed =
    section.formType === 'embed' && section.embedCode
      ? sanitizeHtml(section.embedCode, {
          allowedTags: [
            'a',
            'abbr',
            'b',
            'br',
            'button',
            'div',
            'em',
            'form',
            'iframe',
            'img',
            'input',
            'label',
            'p',
            'section',
            'span',
            'strong',
          ],
          allowedAttributes: {
            a: ['href', 'target', 'rel'],
            button: ['type'],
            div: ['class'],
            form: ['action', 'method', 'target'],
            iframe: ['src', 'width', 'height', 'title', 'allow', 'allowfullscreen'],
            img: ['src', 'alt', 'width', 'height'],
            input: ['type', 'name', 'value', 'placeholder', 'required', 'checked', 'class'],
            label: ['for', 'class'],
            section: ['class'],
            span: ['class'],
          },
          allowedIframeHostnames: ['calendly.com', 'app.hubspot.com', 'docs.google.com'],
        })
      : null

  const layout = getSectionLayout(section, { baseClassName: 'bg-surface' })

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'grid gap-10 md:grid-cols-2')}>
        <div className="space-y-4">
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-semibold text-strong">{section.title}</h2>
          {section.description ? <p className="text-base text-muted">{section.description}</p> : null}
          <div className="space-y-2 text-sm text-muted">
            {site?.phone ? (
              <p>
                <span className="font-semibold text-muted">Phone:</span> {site.phone}
              </p>
            ) : null}
            {site?.email ? (
              <p>
                <span className="font-semibold text-muted">Email:</span> {site.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-divider bg-surface-muted p-8 shadow-elevated">
          {section.formType === 'embed' && sanitizedEmbed ? (
            <div dangerouslySetInnerHTML={{ __html: sanitizedEmbed }} />
          ) : section.formType === 'external' && externalResolved ? (
            <div className="space-y-4 text-sm">
              <CtaButton cta={{ label: 'Open booking form', link: section.externalLink!, style: 'primary' }} />
            </div>
          ) : !leadsEnabled ? (
            <p className="text-sm text-muted">
              Lead capture is not configured yet. Add <code className="rounded bg-surface-muted px-1 py-0.5">SANITY_API_WRITE_TOKEN</code>{' '}
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
