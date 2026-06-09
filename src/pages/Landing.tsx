import Header from "../components/Header";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Solution from "../components/Solution";
import Personas from "../components/Personas";
import WhyUs from "../components/WhyUs";
import Waitlist from "../components/Waitlist";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Personas />
        <WhyUs />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
