import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ClubSection from '@/components/ClubSection';
import PPPSection from '@/components/PPPSection';
import JoinFunnel from '@/components/JoinFunnel/JoinFunnel';
import TarifsSection from '@/components/TarifsSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ClubSection />
        <PPPSection />
        <JoinFunnel />
        <TarifsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
