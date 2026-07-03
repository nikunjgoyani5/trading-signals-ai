import Container from "@/components/common/container/Container";
import ContactForm from "@/components/sections/contact/ContactForm";
import ContactHero from "@/components/sections/contact/ContactHero";
import FAQ from "@/components/sections/faq/FAQ";
import NoiseOverlay from "@/components/NoiseOverlay";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Trading Signals AI for support, partnerships, or product questions.",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-[#010B24] pt-24 sm:pt-28 md:pt-32 lg:pt-36">
      <NoiseOverlay />

      <section className="relative z-10">
        <Container>
          <ContactHero />
        </Container>

        <div className="relative z-10 mx-auto mt-10 w-full max-w-[1000px] px-4 sm:mt-16 sm:px-6 md:mt-20">
          <ContactForm />
        </div>
      </section>

      <div className="relative z-10 mt-24 overflow-y-hidden md:mt-28">
        <FAQ />
      </div>
    </main>
  );
}
