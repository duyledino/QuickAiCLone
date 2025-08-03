import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { assets, plan } from "../assets/assets";
import Button from "./Button";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import Loading from "./Loading";
import BillingModal from "./BillingModal";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const Billing = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const [myPlan, setMyPlan] = useState(null);
  const [isOpen, setOpen] = useState(false);
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
          console.log("user_plan :",response?.data?.user?.user_plan);
          setMyPlan(response?.data?.user?.user_plan);
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
      <div className="container mx-auto my-32 w-full flex flex-col  justify-center items-center gap-5">
        <h1 className="text-6xl text-black font-extrabold">Choose Your Plan</h1>
        <h2 className="text-gray-500 max-w-[600px] text-center">
          Start for free and scale up as you grow. Find the perfect plan for
          your content creation needs.
        </h2>
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-8">
          {user === null
            ? plan.map((item, index) => (
                <div
                  className="flex flex-col w-[50%] min-w-[280px] lg:w-[320px] shadow-[-5px_5px_20px_rgba(0,0,0,0.3)] rounded-2xl"
                  key={index}
                >
                  <div className="w-full flex flex-col justify-between p-2 bg-gray-200 rounded-t-2xl gap-2">
                    <h1 className="text-[18px] font-bold">{item.title}</h1>
                    <h1 className="text-[18px] font-bold">{item.price} VND</h1>
                    <p className="text-[15px] text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-col p-2.5 gap-2.5 h-56">
                    {item.benefit.map((i, j) => (
                      <div key={j} className="w-fit flex gap-3 text-gray-700">
                        <Check className="w-3.5 text-gray-400" />{" "}
                        <p className="text-[12px]" key={j * 4}>
                          {i}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center p-5 bg-gray-200 rounded-b-2xl">
                    <Button
                      className={`w-full !bg-black rounded-[10px] justify-center`}
                    >
                      Subcribe
                    </Button>
                  </div>
                </div>
              ))
            : myPlan !== undefined && myPlan === "Free"
            ? plan.map((item, index) => (
                <div
                  className="flex flex-col w-[50%] min-w-[280px] lg:w-[320px] shadow-[-5px_5px_20px_rgba(0,0,0,0.3)] rounded-2xl"
                  key={index}
                >
                  <div className="w-full flex flex-col justify-between p-2 bg-gray-200 rounded-t-2xl gap-2">
                    <h1 className="text-[18px] font-bold">{item.title}</h1>
                    <h1 className="text-[18px] font-bold">{item.price} VND</h1>
                    <p className="text-[15px] text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-col p-2.5 gap-2.5 h-56">
                    {item.benefit.map((i, j) => (
                      <div className="w-fit flex gap-3 text-gray-700">
                        <Check className="w-3.5 text-gray-400" />{" "}
                        <p className="text-[12px]" key={j * 4}>
                          {i}
                        </p>
                      </div>
                    ))}
                  </div>
                  {item.title === "Free" ? (
                    <div className="flex justify-center items-center p-5 bg-gray-200 rounded-b-2xl">
                      <Button
                      onClick={openSignIn}
                        className={`w-full !bg-gray-400 rounded-[10px] justify-center`}
                      >
                        Already
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex justify-center items-center p-5 bg-gray-200 rounded-b-2xl"
                      onClick={() => setOpen(true)}
                    >
                      <Button
                        className={`w-full !bg-black rounded-[10px] justify-center`}
                      >
                        Subcribe
                      </Button>
                    </div>
                  )}
                </div>
              ))
            : plan.map((item, index) => (
                <div
                  className="flex flex-col w-[50%] min-w-[280px] lg:w-[320px] shadow-[-5px_5px_20px_rgba(0,0,0,0.3)] rounded-2xl"
                  key={index}
                >
                  <div className="w-full flex flex-col justify-between p-2 bg-gray-200 rounded-t-2xl gap-2">
                    <h1 className="text-[18px] font-bold">{item.title}</h1>
                    <h1 className="text-[18px] font-bold">{item.price} VND</h1>
                    <p className="text-[15px] text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-col p-2.5 gap-2.5 h-56">
                    {item.benefit.map((i, j) => (
                      <div className="w-fit flex gap-3 text-gray-700">
                        <Check className="w-3.5 text-gray-400" />{" "}
                        <p className="text-[12px]" key={j * 4}>
                          {i}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center p-5 bg-gray-200 rounded-b-2xl">
                    <Button
                      className={`w-full !bg-gray-400 rounded-[10px] justify-center`}
                    >
                      Already
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default Billing;
