import { useScroll, useTransform } from "motion/react";
import Billing from "../Components/Billing";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
import LoveByCreators from "../Components/LoveByCreators";
import Nav from "../Components/Nav";
import Tools from "../Components/Tools";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const {scrollYProgress} = useScroll();
  const path = useLocation();
  useEffect(()=>{
    window.scrollTo({
      top:0,behavior:'smooth'
    })
  },[path])
  return (
    <>
      <Nav />
      <Hero />
      <Tools/>
      <LoveByCreators/>
      <Billing/>
      <Footer/>
    </>
  );
}

export default Home;
