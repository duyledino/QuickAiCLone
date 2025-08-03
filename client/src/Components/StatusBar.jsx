import React, { useEffect, useState } from "react";
import { Sparkles, Gem, Star } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const StatusBar = ({numberCreation}) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [myPlan, setMyPlan] = useState(null);
  useEffect(() => {
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
        if (response.status === 200) {
          console.log(response.data);
          console.log("user_plan :");
          setMyPlan(response.data?.user?.user_plan);
        }
      } catch (error) {
        console.error(error);
        toast.error(err.response?.data?.Message || "Something went wrong");
      }
    };

    if (user !== null) {
      fetchApi();
    }
  }, [user]);
  console.log("myPlan in status bar: ",myPlan)
  return (
    <div className="flex lg:flex-row flex-col gap-7">
      <div className="p-3 flex items-center justify-between w-2xs border-gray-400 bg-white rounded-[10px] shadow-[0_0_5px_1px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col">
          <h2 className="text-gray-400 capitalize">total creations</h2>
          <h1 className="text-gray-950 text-2xl">{numberCreation}</h1>
        </div>
        <div className="bg-linear-150 from-blue-700 to-blue-300 rounded-[12px] w-12 h-12 flex justify-center items-center">
          <Sparkles className="text-white " />
        </div>
      </div>
      {myPlan === "Free" ? (
        <div className="p-3 flex items-center justify-between w-2xs border-gray-400 bg-white rounded-[10px] shadow-[0_0_5px_1px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col">
            <h2 className="text-gray-400 capitalize">action plan</h2>
            <h1 className="text-gray-950 capitalize text-2xl">free</h1>
          </div>
          <div className="bg-linear-150 from-yellow-300 to-yellow-700 rounded-[12px] w-12 h-12 flex justify-center items-center">
            <Star className="text-white" />
          </div>
        </div>
      ) : (
        <div className="p-3 flex items-center justify-between w-2xs border-gray-400 bg-white rounded-[10px] shadow-[0_0_5px_1px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col">
            <h2 className="text-gray-400 capitalize">action plan</h2>
            <h1 className="text-gray-950 capitalize text-2xl">premium</h1>
          </div>
          <div className="bg-linear-150 from-pink-300 to-pink-700 rounded-[12px] w-12 h-12 flex justify-center items-center">
            <Gem className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBar;
