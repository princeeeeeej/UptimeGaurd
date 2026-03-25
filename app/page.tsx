import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WhySection from "@/components/WhySection";

export default function Home() {

  return (
    <main className="bg-[#F4EAE6] overflow-y-hidden">
      <HeroSection/>
      <WhySection/>
      <Footer/>
    </main>
  );
}
