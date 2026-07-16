import SiteHeader from "@/components/sections/SiteHeader";
import Hero from "@/components/sections/Hero";
import IntroBlue from "@/components/sections/IntroBlue";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import News from "@/components/sections/News";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <IntroBlue />
        <Services />
        <Process />
        <Projects />
        <Testimonials />
        <News />
      </main>
      <Footer />
    </>
  );
}
