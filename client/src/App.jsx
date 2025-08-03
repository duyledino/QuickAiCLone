import { Route, Routes } from "react-router-dom";
import Home from "./Page/Home";
import WriteArticle from "./Page/WriteArticle";
import GenerateImages from "./Page/GenerateImages";
import RemoveBackground from "./Page/RemoveBackground";
import ReviewResume from "./Page/ReviewResume";
import Community from "./Page/Community";
import Dashboard from "./Page/Dashboard";
import Layout from "./Components/Layout";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import {ToastContainer} from 'react-toastify'
import PaymentResult from "./Page/PaymentResult";

function App() {
  const {getToken} = useAuth();
  useEffect(()=>{
    const fetchApi = async ()=>{
      const token = await getToken();
      console.log(token);
    }
    fetchApi();
  },[])
  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route>
        <Route path="/payment" element={<PaymentResult/>}/>
      </Routes>
    </>
  );
}

export default App;
