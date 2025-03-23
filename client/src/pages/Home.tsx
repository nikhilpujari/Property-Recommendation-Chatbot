import Hero from "@/components/home/Hero";
import PropertySearch from "@/components/home/PropertySearch";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Projects from "@/components/home/Projects";
import Financing from "@/components/home/Financing";
import AboutUs from "@/components/home/AboutUs";
import Contact from "@/components/home/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <PropertySearch />
      <FeaturedProperties />
      <Projects />
      <Financing />
      <AboutUs />
      <Contact />
    </>
  );
};

export default Home;
