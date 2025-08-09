import { Eraser, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import Configuration from "../Components/Configuration";
import GenerateSection from "../Components/GenerateSection";
import Markdown from "react-markdown";
import { useLocation } from "react-router-dom";
import { LinkSidebar } from "../assets/assets";
import ContentInstruction from "../Components/ContentInstruction";
import { motion } from "motion/react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";
import Process from "../Components/Process";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const RemoveBackground = () => {
  const [process, setProcess] = useState(null);
  const path = useLocation();
  const object = LinkSidebar.find((l) => l.path === path.pathname);
  const { getToken } = useAuth();
  const [image, setImage] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await axios.post("/ai/background_removal", formData, {
        onUploadProgress: (event) => {
          if (event.total > 0) {
            const currentProcess = Math.floor(
              (event.loaded * 60) / event.total
            );
            setProcess(currentProcess);
          }
        },
        onDownloadProgress: (event) => {
          if (event.total > 0) {
            const currentProcess = Math.floor(
              (event.loaded * 40) / event.total
            );
            setProcess((prev) => (prev += currentProcess));
          }
        },
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (response.status === 200) {
        setContent(response.data.uploadResult);
        setLoading(false);
      }
    } catch (error) {
      const message =
        error.response?.data?.Message ||
        error.message ||
        "Something went wrong";
      toast.error(message, { autoClose: 3500 });
      setLoading(false);
    }
  };
  useEffect(() => {
    let Timeout;
    if (process !== null && process === 100) {
      Timeout = setTimeout(() => {
        setProcess(null);
      }, 1000);
    }
    return () => clearTimeout(Timeout);
  }, [process]);
  return (
    <>
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
                <h1 className="text-gray-950 font-semibold">
                  Background Removal
                </h1>
              </div>
              <div className="text-[14px] flex flex-col gap-2">
                <h1 className="text-gray-950 font-semibold">Upload Image</h1>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  accept="image/*"
                  required
                  className={`w-full p-2 outline-none ring ring-gray-400 rounded-[4px]`}
                />
                <h1 className="text-[12px] text-gray-400">
                  Supports JPG, PNG, and other image formats
                </h1>
              </div>
              {process !== null ? <Process process={process} /> : ""}
              <button
                disabled={loading}
                type="submit"
                className={`text-center text-white text-[12px] flex items-center justify-center gap-2 p-1.5 rounded-[4px] ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{
                  background: `linear-gradient(120deg,${object.bg.from},${object.bg.to})`,
                }}
              >
                {loading ? "Loading..." : ""}
                <object.Icon />
                <h1>Remove Background</h1>
              </button>
            </form>
          </Configuration>
        </div>
        <div>
          <GenerateSection
            className={
              "rounded-2xl w-full max-w-xl lg:w-xl shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] bg-white"
            }
          >
            <div className="flex flex-col w-full h-full gap-2 p-4">
              <div className="text-2xl flex gap-1 items-center">
                <object.Icon
                  className="font-extrabold"
                  style={{ color: `${object.bg.from}` }}
                />
                <h1 className="text-gray-950 font-semibold">Processed Image</h1>
              </div>
              <div className="w-full h-[90%]">
                {content !== null ? (
                  <img
                    src={content}
                    alt="content"
                    className="w-full h-auto object-contain"
                  />
                ) : (
                  <ContentInstruction />
                )}
              </div>
            </div>
          </GenerateSection>
        </div>
      </motion.div>
    </>
  );
};

export default RemoveBackground;
