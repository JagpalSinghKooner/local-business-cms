import type { PageSection } from '@/types'
import Container from '@/components/layout/Container'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'
import { CtaButton } from '@/components/ui/CtaButton'

type PricingTableSectionProps = {
  section: Extract<PageSection, { _type: 'section.pricingTable' }>
}

export default function PricingTableSection({ section }: PricingTableSectionProps) {
  const plans = Array.isArray(section.plans) ? section.plans : []
  if (!plans.length) return null

  const layout = getSectionLayout(section)
  const mode = section.layoutMode ?? 'cards'

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-10')}>
        <header className="space-y-3 text-center md:max-w-3xl md:mx-auto">
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-semibold text-strong">{section.heading}</h2>
          {section.body ? <p className="text-base text-muted">{section.body}</p> : null}
        </header>

        {mode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="text-left text-sm text-muted">
                  <th className="py-4 pr-4 font-medium text-strong">Plan</th>
                  <th className="py-4 pr-4 font-medium text-strong">Price</th>
                  <th className="py-4 pr-4 font-medium text-strong">Features</th>
                  <th className="py-4 font-medium text-strong">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {plans.map((plan, index) => (
                  <tr key={index} className={plan.isFeatured ? 'bg-surface-muted/60' : ''}>
                    <td className="py-4 pr-4 align-top">
                      <p className="text-lg font-semibold text-strong">{plan.title}</p>
                      {plan.tagline ? <p className="text-sm text-muted">{plan.tagline}</p> : null}
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <p className="text-xl font-semibold text-strong">{plan.price}</p>
                      {plan.frequency ? <p className="text-sm text-muted">{plan.frequency}</p> : null}
                    </td>
                    <td className="py-4 pr-4 align-top text-sm text-muted">
                      {plan.features?.length ? (
                        <ul className="list-disc space-y-2 pl-4">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>{feature}</li>
                          ))}
                        </ul>
                      ) : plan.description ? (
                        <p>{plan.description}</p>
                      ) : null}
                    </td>
                    <td className="py-4 align-top">
                      {plan.cta ? <CtaButton cta={plan.cta} /> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <article
                key={index}
                className={cn(
                  'flex h-full flex-col gap-5 rounded-3xl border border-divider bg-surface p-6 shadow-elevated',
                  plan.isFeatured && 'border-brand/70 shadow-card',
                )}
              >
                <div className="space-y-3 text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                    {plan.tagline || 'Plan'}
                  </p>
                  <h3 className="text-2xl font-semibold text-strong">{plan.title}</h3>
                  {plan.price ? (
                    <p className="text-3xl font-semibold text-strong">
                      {plan.price}
                      {plan.frequency ? <span className="text-sm font-normal text-muted"> · {plan.frequency}</span> : null}
                    </p>
                  ) : null}
                  {plan.description ? <p className="text-sm text-muted">{plan.description}</p> : null}
                </div>
                {plan.features?.length ? (
                  <ul className="space-y-2 text-sm text-muted">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand/80" aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {plan.cta ? (
                  <div className="pt-2">
                    <CtaButton cta={plan.cta} />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}

        {section.footerNote ? <p className="text-sm text-muted">{section.footerNote}</p> : null}
      </Container>
    </section>
  )
}
