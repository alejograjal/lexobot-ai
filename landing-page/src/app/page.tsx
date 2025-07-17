import { Hero } from '@/components/Hero'
import { WhatIsLexoBot } from '@/components/WhatIsLexoBot'
import { ProblemsSection } from '@/components/ProblemsSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { BenefitsSection } from '@/components/BenefitsSection'
import { WhatIncludes } from '@/components/WhatIncludes'
import { CTASection } from '@/components/CTASection'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <WhatIsLexoBot />
      <ProblemsSection />
      <FeaturesSection />
      <BenefitsSection />
      <WhatIncludes />
      <CTASection />
      <Footer />
    </div>
  )
}