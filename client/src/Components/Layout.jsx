import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
    {/* add h-screen (full height screen) to let children can scroll y  */}
      <main className="flex flex-col gap-0.5 h-screen"> 
        <Header setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
        <div className="flex w-full min-h-[91vh]">
          <SideBar showSidebar={showSidebar} />
          <div className="lg:w-[calc(100%-256px)] w-full bg-blue-50 h-full min-h-[91vh] overflow-y-scroll">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default Layout;
