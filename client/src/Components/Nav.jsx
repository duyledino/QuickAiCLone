import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Nav = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  console.log(user);
  return (
    <div className="w-full backdrop-blur-3xl fixed top-0 left-0 z-50 p-4">
      <div className="container mx-auto flex sm:flex-row flex-col sm:gap-0 gap-5  justify-between items-center">
        <Link to={"/"} className="w-fit flex items-center justify-center">
          <img src={assets.logo} alt="logo" />
        </Link>
        {user ? (
          <UserButton />
        ) : (
          <>
            <Button onClick = {openSignIn}>
              Get Started <img src={assets.arrow_icon} alt="arrow-icon" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
