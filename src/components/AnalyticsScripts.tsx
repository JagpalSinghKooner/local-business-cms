import type { ReactElement } from 'react'
import Script from 'next/script'
import type { SiteSettings } from '@/types/sanity'

type AnalyticsScriptsProps = {
  site: SiteSettings | null
}

export default function AnalyticsScripts({ site }: AnalyticsScriptsProps) {
  if (!site) return null

  const scripts: ReactElement[] = []

  if (site.googleTagManagerId) {
    const id = site.googleTagManagerId
    scripts.push(
      <Script id="gtm-loader" key="gtm-loader" strategy="afterInteractive">
        {`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');
        `}
      </Script>
    )
  }

  if (site.googleAnalyticsId) {
    const id = site.googleAnalyticsId
    scripts.push(
      <Script
        key="ga-library"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
    )
    scripts.push(
      <Script id="ga-init" key="ga-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
        `}
      </Script>
    )
  }

  if (site.metaPixelId) {
    const id = site.metaPixelId
    scripts.push(
      <Script id="meta-pixel" key="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');
        `}
      </Script>
    )
  }

  if (Array.isArray(site.trackingScripts)) {
    site.trackingScripts.forEach((script) => {
      const id = `tracking-${script.label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
      const strategy: 'beforeInteractive' | 'afterInteractive' =
        script.location === 'head' ? 'beforeInteractive' : 'afterInteractive'
      scripts.push(
        <Script
          id={id}
          key={id}
          strategy={strategy}
          dangerouslySetInnerHTML={{ __html: script.code }}
        />
      )
    })
  }

  return <>{scripts}</>
}
