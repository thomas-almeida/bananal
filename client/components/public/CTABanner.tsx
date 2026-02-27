interface CTABannerProps {
  headline: string
  description: string
  ctaLabel: string
  ctaUrl: string
}

export default function CTABanner({ headline, description, ctaLabel, ctaUrl }: CTABannerProps) {
  if (!headline) return null

  return (
    <div className="mb-6">
      <h2 className="text-4xl font-extrabold tracking-tighter leading-[0.9] mt-8">{headline}</h2>
      {description && (
        <p className="text-[15px] text-[#555] mt-3 mb-5">{description}</p>
      )}
      {ctaLabel && ctaUrl && (
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full border border-[#ddd] rounded-xl py-[14px] px-4 text-[15px] font-medium hover:bg-gray-50 transition-colors"
        >
          <span className="font-bold">{ctaLabel}</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      )}
    </div>
  )
}
