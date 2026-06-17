import Navbar from '@/components/Navbar';
import RecruitHero from '@/components/recruit/RecruitHero';
import ClubSection from '@/components/ClubSection';
import PPPSection from '@/components/PPPSection';
import TarifsSection from '@/components/TarifsSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <RecruitHero />
        <ClubSection />
        <PPPSection />
        <TarifsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
