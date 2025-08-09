import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { assets, LinkSidebar } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { Crown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import BillingModal from "./BillingModal";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const SideBar = ({ showSidebar }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [plan, setPlan] = useState(null);
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    console.log(user);
    const fetchApi = async () => {
      try {
        const response = await axios.get(
          `/user/user_info?user_id=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        console.log("response in sidebar: ", response);
        if (response.status === 200) {
          setPlan(response?.data?.user?.user_plan);
          console.log("user plan here: ", response?.data?.user?.user_plan);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.Message || "Something went wrong");
      }
    };
    if (user !== null) {
      fetchApi();
    }
  }, [user]);
  return (
    <>
      <BillingModal isOpen={isOpen} setOpen={setOpen} />
      {user && (
        <div
          className={`w-3xs bg-white flex justify-center shadow-[1px_0px_0px_rgba(0,0,0,.1)] lg:static fixed lg:h-[91vh] h-[93vh] z-20 lg:top-15 top-13 left-0 transition-all ${
            showSidebar ? " translate-x-0" : "lg:translate-0 -translate-x-full"
          }`}
        >
          <div className="w-[90%] flex flex-col items-center justify-between gap-3 pt-5">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col justify-center items-center">
                <div className="w-12 h-12 rounded-[50%] border-1 flex justify-center items-center ">
                  <img
                    src={user.imageUrl}
                    alt="user's image"
                    className="w-full h-full rounded-[50%]"
                  />
                </div>
                <h1 className="text-[16px] font-bold text-center">
                  {user.fullName}
                </h1>
              </div>
              <div className="w-full flex flex-col">
                {LinkSidebar.map(({ Icon, title, path, bg }, index) => (
                  <NavLink
                    className={`flex gap-3 p-3 w-full`}
                    key={index}
                    to={path}
                    end={path === "/ai"}
                    style={({ isActive }) => {
                      return {
                        borderRadius: "5px",
                        color: isActive ? "white" : "GrayText",
                        background: isActive
                          ? `linear-gradient(to bottom, ${bg.from}, ${bg.to})`
                          : "",
                      };
                    }}
                  >
                    {" "}
                    <Icon />{" "}
                    <p className={"text-[14px] font-semibold"}>{title}</p>
                  </NavLink>
                ))}
                {plan !== undefined && plan !== "Free" ? (
                  ""
                ) : (
                  <div
                    onClick={() => setOpen(true)}
                    className="flex gap-3 text-white p-3 w-full rounded-[5px] transition-all bg-linear-180 from-yellow-500 to-yellow-400 hover:opacity-90 cursor-pointer"
                  >
                    <Crown className="" />{" "}
                    <p className={"text-[14px] font-semibold"}>
                      Upgrade to Premium
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex p-3 justify-between items-center shadow-[0px_-1px_0px_rgba(0,0,0,.1)]">
              <div className="flex gap-2 items-center">
                <img
                  src={user.imageUrl}
                  alt="user-img"
                  className="w-10 h-10 rounded-[50%]"
                />
                <div className="flex flex-col">
                  <h2 className="font-bold">{user.fullName}</h2>
                  <p className="text-gray-400 capitalize">
                    {plan || "plan type"}
                  </p>
                </div>
              </div>
              <LogOut className="cursor-pointer" onClick={signOut} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
