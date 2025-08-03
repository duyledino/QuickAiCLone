import { motion } from "motion/react";
import { plan } from "../assets/assets";
import { Check } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "./Loading";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const BillingModal = ({ isOpen, setOpen }) => {
  const [userId, setUserId] = useState(null);
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleSwitchToPremium = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        `/user/upgradePlan`,
        { amount: 80000 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("PaymentURL in client: ",response.data.PaymentURL);
      if (response.status === 200) {
        setOpen(false);
        setUserId(response.data.user_id);
        window.open(response.data.PaymentURL, "_blank");
      }
    } catch (error) {
      const message =
        error.response?.data?.Message ||
        error.message ||
        "Something went wrong";
      toast.error(message, { autoClose: 3500 });
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? <Loading /> : ""}
      <motion.div
        initial={{ opacity: 0, translateY: "-10px" }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0, translateY: "-10px" }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">Billing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-md border-2 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Free Plan
              </h3>
              <p className="text-gray-600 mb-1">
                Price: <span className="font-medium">0 VNĐ</span>
              </p>
              <div className="flex flex-col gap-1 mb-5">
                {plan[0].benefit.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-950"
                  >
                    <Check className="w-4 h-4" />
                    <p className="text-[12px] font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-600 font-semibold ">
                Current Plan
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Premium Plan
              </h3>
              <p className="text-gray-600 mb-1">
                Price: <span className="font-medium">80000 VNĐ</span>
              </p>
              <div className="flex flex-col gap-1 mb-3">
                {plan[1].benefit.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-950"
                  >
                    <Check className="w-4 h-4" />
                    <p className="text-[12px] font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSwitchToPremium}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
              >
                Switch to Premium
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default BillingModal;
