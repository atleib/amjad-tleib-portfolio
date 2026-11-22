import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <About site={site} />
        <Experience jobs={site.experience} />
        <Projects projects={site.projects} />
        <Contact contact={site.contact} />
      </main>
      <Footer name={site.name} />
    </>
  );
}
