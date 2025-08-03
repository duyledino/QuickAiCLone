import React, { useState } from "react";
import Configuration from "../Components/Configuration";
import GenerateSection from "../Components/GenerateSection";
import { Sparkles } from "lucide-react";
import { assets, LinkSidebar, dummyCreationData } from "../assets/assets";
import { useLocation } from "react-router-dom";
import ContentInstruction from "../Components/ContentInstruction";
import Markdown from "react-markdown";
import { motion } from "motion/react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];
  const path = useLocation();
  const object = LinkSidebar.find((l) => l.path === path.pathname);
  const { getToken } = useAuth();
  const [length, setLength] = useState(articleLength[0].length);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState("");
  const fetchApi = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
      "/ai/article_writter",
      {
        articleTopic: article,
        length: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );
    if (response.status === 200) {
      setLoading(false);
      setContent(response.data.article);
    }
    } catch (error) {
     toast.error(error.response?.data?.Message||error.message||"something went wrong",{autoClose:3500}) ;
     setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (article.trim() !== "") {
      fetchApi();
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
              <h1 className="text-gray-950 font-semibold">
                Article Configuration
              </h1>
            </div>
            <div className="text-[14px] flex flex-col gap-2">
              <h1 className="text-gray-950 font-semibold">Article Topic</h1>
              <input
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                required
                type="text"
                placeholder="The future of artical intelligence is..."
                className={`w-full  p-2 outline-none ring ring-gray-400 rounded-[4px]`}
              />
            </div>
            <div className="text-[14px] flex flex-col gap-2">
              <h1 className="text-gray-950 font-semibold">Article Length</h1>
              <div className="flex flex-wrap gap-5">
                {articleLength.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setLength(item.length)}
                    className={`cursor-pointer rounded-full ring ${
                      item.length === length
                        ? "ring-blue-500 text-blue-500 bg-blue-100"
                        : "ring-gray-400"
                    }  p-2 text-[12px]`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
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
              <h1>Generate article</h1>
            </button>
          </form>
        </Configuration>
      </div>
      <GenerateSection
        className={
          "rounded-2xl min-h-96 max-h-[600px] lg:w-xl w-full shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] bg-white"
        }
      >
        <div className="flex flex-col w-full h-full gap-2 p-4">
          <div className="text-2xl flex gap-1 items-center">
            <object.Icon
              className="font-extrabold"
              style={{ color: `${object.bg.from}` }}
            />
            <h1 className="text-gray-950 font-semibold">
              Article Configuration
            </h1>
          </div>
          <div className="w-full h-[90%]">
            {content !== null ? (
              <div className="w-full h-full overflow-y-auto">
                <div className="reset-tw">
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            ) : (
              <ContentInstruction />
            )}
          </div>
        </div>
      </GenerateSection>
    </motion.div>
  );
};

export default WriteArticle;
