import React from "react";
import { assets } from "../assets/assets";
import Button from "./Button";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const Hero = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const handleOnClick = () => {
    if (!user) {
      openSignIn();
      return;
    }
    navigate("/ai");
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, translateY: "10px" }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3 }}
        className={`bgGradient w-full h-screen flex justify-center items-center`}
      >
        <div className="w-full  max-w-[800px] flex flex-col items-center gap-5">
          <h1 className="md:text-6xl text-4xl text-black font-extrabold text-center">
            Create amazing content with{" "}
            <span className="text-[var(--highlight)]">AI tools</span>
          </h1>
          <p className="text-gray-700 text-center w-full">
            Transform your content creation with our suite of premium AI tools.
            Write articles, generate images, and enhance your workflow.
          </p>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-9">
            <Button
              onClick={() => handleOnClick()}
              className={`rounded-xl px-5 py-3 text-[18px] justify-center transition-all hover:scale-105`}
            >
              Start creating now
            </Button>
            <Button
              className={`rounded-xl px-5 py-3 text-[18px] transition-all justify-center hover:scale-105 lg:bg-white bg-gray-100 !text-black`}
            >
              Watch demo
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <img src={assets.user_group} alt="user_group" className="w-32" />
            <p className="text-gray-700 text-center">Trusted by 10k+ people</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Hero;
