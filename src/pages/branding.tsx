import React from 'react'
import LakesidePage from '@site/src/components/landing/ui/LakesidePage'
import BrandingHero from '@site/src/components/landing/branding/BrandingHero'
import LogoSection from '@site/src/components/landing/branding/LogoSection'
import ColorSection from '@site/src/components/landing/branding/ColorSection'
import TypographySection from '@site/src/components/landing/branding/TypographySection'
import { BRANDING_SEO } from '@site/src/data/landing/branding'

export default function BrandingPage() {
  return (
    <LakesidePage
      title={BRANDING_SEO.title}
      description={BRANDING_SEO.description}
      activePath='/branding'
      heroBackground={<BrandingHero />}
    >
      <LogoSection />
      <ColorSection />
      <TypographySection />
    </LakesidePage>
  )
}
