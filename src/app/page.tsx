import SiteHeader from '@/components/template/SiteHeader';
import SiteHero from '@/components/template/SiteHero';
import ClubSection from '@/components/sections/ClubSection';
import DisciplinesSection from '@/components/sections/DisciplinesSection';
import PPPSection from '@/components/sections/PPPSection';
import PricingSection from '@/components/sections/PricingSection';
import InfosSection from '@/components/sections/InfosSection';
import EndzoneSection from '@/components/sections/EndzoneSection';
import SiteFooter from '@/components/sections/SiteFooter';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <SiteHero />
      <ClubSection />
      <DisciplinesSection />
      <PPPSection />
      <PricingSection />
      <InfosSection />
      <EndzoneSection />
      <SiteFooter />
    </>
  );
}
