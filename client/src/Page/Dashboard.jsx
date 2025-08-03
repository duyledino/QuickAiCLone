import { useState } from "react";
import AllCreations from "../Components/AllCreations";
import StatusBar from "../Components/StatusBar";
import { motion } from "motion/react";
import Loading from "../Components/Loading";

const Dashboard = () => {
  const [numberCreation, setNumberCreation] = useState(0);
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? <Loading /> : ""}

      <motion.div
        initial={{ opacity: 0, translateY: "10px" }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 flex flex-col gap-5"
      >
        <StatusBar numberCreation={numberCreation} />
        <AllCreations setNumberCreation={setNumberCreation} setLoading={setLoading}/>
      </motion.div>
    </>
  );
};

export default Dashboard;
