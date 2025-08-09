import { Image, PictureInPictureIcon, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import ContentInstruction from "../Components/ContentInstruction";
import { useLocation } from "react-router-dom";
import { LinkSidebar } from "../assets/assets";
import Configuration from "../Components/Configuration";
import GenerateSection from "../Components/GenerateSection";
import { motion } from "motion/react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import Process from "../Components/Process";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const sytles = [
  { style: "Realistic" },
  { style: "Ghibli" },
  { style: "Anime" },
  { style: "Cartoon" },
  { style: "Fantasy" },
  { style: "3D" },
  { style: "Portrait" },
];

const GenerateImages = () => {
  const path = useLocation();
  const object = LinkSidebar.find((l) => l.path === path.pathname);
  const { getToken } = useAuth();
  const [process, setProcess] = useState(null);
  const [style, setStyle] = useState(sytles[0].style);
  const [content, setContent] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prompt !== "") {
      setLoading(true);
      setProcess(0);
      try {
        const response = await axios.post(
          "/ai/image_generator",
          {
            prompt: prompt,
            style: style,
            publish: publish,
          },
          {
            onUploadProgress: (event) => {
              if (event.total > 0) {
                const currentProcess = Math.floor(
                  (event.loaded * 60) / event.total
                );
                setProcess(currentProcess);
              }
            },
            // On Vercel, I only get upload progress because the response is sent as one big chunk at the end — no streaming → no incremental download progress.
            // onDownloadProgress: (event) => {
            //   if (event.total > 0) {
            //     const currentProcess = Math.floor(
            //       (event.loaded * 40) / event.total
            //     );
            //     setProcess((prev) => (prev += currentProcess));
            //   }
            // },
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.imagesURL.status === 422) {
            console.log(
              "show error",
              response.data.imagesURL.error.error.message
            );
            toast.error(response.data.imagesURL.error.error.message, {
              autoClose: 3500,
            });
            //
            setProcess(100);
            setLoading(false);
            return;
          }
          setProcess(100);
          setContent(response.data.imagesURL);
          setLoading(false);
        }
      } catch (error) {
        const message =
          error.response?.data?.Message ||
          error.message ||
          "Something went wrong";
        setProcess(100);
        toast.error(message, { autoClose: 3500 });
        setLoading(false);
      }
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
    <motion.div
      initial={{ opacity: 0, translateY: "10px" }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      className="p-3 flex flex-wrap  gap-5"
    >
      <div>
        <Configuration
          className={
            "rounded-2xl lg:w-lg min-h-96 max-h-[600px] w-full shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] bg-white"
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
                AI Image Generator
              </h1>
            </div>
            <div className="text-[14px] flex flex-col gap-2">
              <h1 className="text-gray-950 font-semibold">
                Describe Your Image
              </h1>
              <textarea
                onChange={(e) => setPrompt(e.target.value)}
                required
                placeholder="Decribe what you want to see in the image..."
                className={`w-full h-24  p-2 outline-none ring ring-gray-400 rounded-[4px]`}
              />
            </div>
            <div className="text-[14px] flex flex-col gap-2">
              <h1 className="text-gray-950 font-semibold">Style</h1>
              <div className="flex flex-wrap gap-5">
                {sytles.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setStyle(item.style)}
                    className={`cursor-pointer w-20 text-center rounded-full ring ${
                      item.style === style
                        ? "ring-green-500 text-green-500 bg-green-100"
                        : "ring-gray-400"
                    }  p-2 text-[12px]`}
                  >
                    {item.style}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex items-center gap-2 text-gray-400">
              <div
                className={`rounded-full flex items-center w-12 p-2.5 bg-gray-500 transition-all relative cursor-pointer`}
                style={{ backgroundColor: `${publish ? object.bg.from : ""}` }}
                onClick={() => setPublish((prev) => !prev)}
              >
                <div
                  className="rounded-full w-3 h-3 bg-white absolute transition-all"
                  style={{
                    left: publish ? "calc(100% - 1rem)" : "0.25rem",
                  }}
                ></div>
              </div>
              <h1 className="text-sm">Make this image Public</h1>
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
              <h1>Generate Image</h1>
            </button>
          </form>
        </Configuration>
      </div>
      <div>
        <GenerateSection
          className={
            "rounded-2xl w-full max-w-xl lg:w-xl shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] bg-white flex flex-col gap-2 p-4"
          }
        >
          <div className="flex flex-col w-full h-full gap-2 p-4">
            <div className="text-2xl flex gap-1 items-center">
              <object.Icon
                className="font-extrabold"
                style={{ color: `${object.bg.from}` }}
              />
              <h1 className="text-gray-950 font-semibold">Generated image</h1>
            </div>
            <div className="h-[90%] w-full flex items-start justify-center">
              {content !== null ? (
                <img
                  src={content}
                  alt={content}
                  className="max-w-full h-auto object-contain"
                />
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

export default GenerateImages;
