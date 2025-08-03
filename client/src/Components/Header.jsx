import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Menu,X } from "lucide-react";

const Header = ({ className, showSidebar, setShowSidebar }) => {
  return (
    <header
      className={`w-full bg-white h-[8vh] flex items-center shadow-[0px_1px_0px_rgba(0,0,0,0.1)] ${className}`}
    >
      <div className="w-full max-w-[95%] mx-auto flex items-center lg:justify-normal justify-between ">
        <Link to={`/`}>
          <img src={assets.logo} alt="logo" className="w-44" />
        </Link>
        <div className={`cursor-pointer lg:hidden block`} onClick={() => setShowSidebar((prev) => !prev)}>
        {showSidebar ? <X/>:<Menu /> }
        </div>
      </div>
    </header>
  );
};

export default Header;
