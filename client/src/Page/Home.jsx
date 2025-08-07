import { useScroll, useTransform } from "motion/react";
import Billing from "../Components/Billing";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
import LoveByCreators from "../Components/LoveByCreators";
import Nav from "../Components/Nav";
import Tools from "../Components/Tools";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../Components/Loading";

function Home() {
  const [loading, setLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const path = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [path]);
  return (
    <>
      {loading ? <Loading /> : ""}
      <Nav />
      <Hero />
      <Tools />
      <LoveByCreators />
      <Billing setLoading={setLoading} />
      <Footer />
    </>
  );
}

export default Home;
