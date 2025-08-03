import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { LinkSidebar } from "../assets/assets";
import Configuration from "../Components/Configuration";
import { Sparkles, FileText } from "lucide-react";
import GenerateSection from "../Components/GenerateSection";
import ContentInstruction from "../Components/ContentInstruction";
import Markdown from "react-markdown";
import { motion } from "motion/react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const ReviewResume = () => {
  const path = useLocation();
  const object = LinkSidebar.find((l) => l.path === path.pathname);
  const { getToken } = useAuth();
  const [content, setContent] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", pdf);
    try {
      const response = await axios.post("/ai/resume_reviewer", formData, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    console.log(response.data);
    if (response.status === 200) {
      setContent(response.data.pdfData);
      setLoading(false);
    }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.Message||error.message||"Something went wrong",{autoClose:3500});
      setLoading(false)
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, translateY: "10px" }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      className="p-3 flex flex-wrap  gap-5"
    >
      <div>
        <Configuration
          className={
            "rounded-2xl lg:w-lg w-full shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] bg-white"
          }
        >
          <form
            className="flex w-full flex-col justify-between p-4 gap-4"
            onSubmit={handleSubmit}
          >
            <div className="text-2xl flex gap-1 items-center">
              <Sparkles
                className="font-extrabold"
                style={{ color: `${object.bg.from}` }}
              />
              <h1 className="text-gray-950 font-semibold">Resume Review</h1>
            </div>
            <div className="text-[14px] flex flex-col gap-2">
              <h1 className="text-gray-950 font-semibold">Upload Resume</h1>
              <input
                onChange={(e) => setPdf(e.target.files[0])}
                type="file"
                accept="application/pdf"
                required
                className={`w-full p-2 outline-none ring ring-gray-400 rounded-[4px]`}
              />
              <h1 className="text-[12px] text-gray-400">
                Supports PDF resume only.
              </h1>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="cursor-pointer text-center text-white text-[12px] flex items-center justify-center gap-2 p-1.5 rounded-[4px]"
              style={{
                background: `linear-gradient(120deg,${object.bg.from},${object.bg.to})`,
              }}
            >
              {loading ? "Loading..." : ""}
              <object.Icon />
              <h1>{object.title}</h1>
            </button>
          </form>
        </Configuration>
      </div>
      <div>
        <GenerateSection
          className={
            "rounded-2xl w-full min-h-96 max-h-[600px] lg:w-xl  shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] bg-white overflow-y-auto"
          }
        >
          <div className="flex flex-col w-full h-full gap-2 p-4">
            <div className="text-2xl flex gap-1 items-center">
              <object.Icon
                className="font-extrabold"
                style={{ color: `${object.bg.from}` }}
              />
              <h1 className="text-gray-950 font-semibold">Analysis Results</h1>
            </div>
            <div className="w-full h-[90%]">
              {content !== null ? (
                <div className="w-full h-full">
                  <Markdown>{content}</Markdown>
                </div>
              ) : (
                <ContentInstruction />
              )}
            </div>
          </div>
        </GenerateSection>
      </div>
    </motion.div>
  );
};

export default ReviewResume;
