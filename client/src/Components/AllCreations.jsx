import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { handleDate } from "../util/handleDate.js";
import Loading from "./Loading.jsx";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AllCreations = ({setNumberCreation,setLoading}) => {
  const { user } = useUser();
  const [showContent, setShowContent] = useState([]);
  const [creations, setCreations] = useState([]);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      if (user != undefined) {
        try {
          console.log(user.id);
          const user_id = user.id;
          const response = await axios.get(
            `/user/user_creation?user_id=${user_id}`,
            {
              headers: {
                Authorization: `Bearer ${await getToken()}`,
              },
            }
          );
          if (response.status === 200) {
            console.log(response.data.creations);
            setNumberCreation(response.data.creations.length)
            setCreations(response.data.creations);
          }
        } catch (error) {
          console.error(error);
          toast.error(
            error.response?.data?.Message ||
              error.message ||
              "Something went wrong"
          );
        }
      }
      setLoading(false);
    };
    fetchApi();
  }, [user]);
  return (
    <>
    <div className="gap-5 flex flex-col ">
      <h1>Recent Creations</h1>
      <div className="flex w-full flex-col gap-4">
        {creations.length === 0
          ? ""
          : creations?.map(
              ({ prompt, creation_id, type, update_at, content }, index) => (
                <div
                  onClick={() =>
                    setShowContent((prev) => {
                      if (prev.find((p) => p === creation_id)) {
                        return prev.filter((p) => p != creation_id);
                      }
                      return [...prev, creation_id];
                    })
                  }
                  className="bg-white p-3 lg:w-[80%] lg:min-w-[750px] lg:gap-5 flex flex-col gap-3 justify-between roundex shadow-[0_0_5px_1px_rgba(0,0,0,0.2)] rounded-[12px] cursor-pointer"
                  key={index}
                >
                  <div className="flex lg:flex-row lg:gap-0 gap-3 flex-col justify-between lg:items-center">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-black text-[14px] font-semibold">
                        {prompt}
                      </h1>
                      <h1 className="text-gray-500 text-[14px]">
                        {type} - {handleDate(update_at)}
                      </h1>
                    </div>
                    <div className="rounded-[100px] bg-blue-200 text-blue-700 text-center px-5 py-3 w-fit">
                      {type}
                    </div>
                  </div>
                  {/* 'Image Generation' */}
                  {/* 'Background Removal' */}
                  {showContent.find((s) => s === creation_id) ? (
                    type === "Image Generation" ||
                    type === "Background Removal" ? (
                      <img src={content} alt="Image" />
                    ) : (
                      <div className="content here w-full reset-tw text-[20px]">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>
              )
            )}
      </div>
    </div>
    </>
  );
};

export default AllCreations;
