import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("user_id");
  const [status, setStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkPaymentStatus = async () => {
      setLoading(true);
      if (!paymentId) {
        setStatus("error");
        toast.error("Missing payment ID");
        return;
      }
      try {
        const res = await axios.get(
          `/user/payment_status?user_id=${paymentId}`
        );
        setStatus("success");
        toast.success(res.data.Message || "Payment successful!");
        console.log(res);
      } catch (err) {
        setStatus("error");
        toast.error(
          err.response?.data?.Message || "Failed to check payment status"
        );
      }
      setLoading(false);
      toast.info("Back to home after 5s", { autoClose: 5000 });
    };

    checkPaymentStatus();
  }, [paymentId]);

  useEffect(() => {
    let timeOutId;
    if (status === "error" || status === "success") {
      timeOutId = setTimeout(() => {
        navigate("/");
      }, 5000);
    }
    return;
  }, [status]);

  const renderMessage = () => {
    switch (status) {
      case "success":
        return <p className="text-green-600 text-xl">✅ Payment successful!</p>;
      case "error":
        return (
          <p className="text-orange-600 text-xl">⚠️ Error checking payment.</p>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? <Loading /> : ""}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-semibold mb-4">Payment Result</h1>
          {renderMessage()}
        </div>
      </div>
    </>
  );
};

export default PaymentResult;
