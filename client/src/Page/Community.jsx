import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const Community = () => {
  const [community, setCommunity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [change, setChange] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/community`);
        if (response.status === 200) {
          console.log(response);
          setCommunity(response.data.community);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.Message ||
            error.message ||
            "Something went wrong"
        );
      }
      setLoading(false);
    };
    fetchApi();
  }, [change]);
  console.log(user?.id, community);
  const handleLike = async (creation_id, likes) => {
    try {
      if (likes.find((e) => e === user.id))
        likes = likes.filter((e) => e !== user.id);
      else likes.push(user.id);
      const response = await axios.post(
        `/user/likeCreation?creation_id=${creation_id}`,
        {
          likes: likes,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        setChange((prev) => !prev);
        if (response.data.Message !== "") {
          toast.success(response.data.Message, { autoClose: 3500 });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.Message ||
          error.message ||
          "Something went wrong",
        { autoClose: 3500 }
      );
    }
  };
  return (
    <>
      {loading ? <Loading /> : ""}

      <div className="p-3 flex flex-col gap-5">
        <h1>Creations</h1>
        <div className="flex flex-wrap gap-3 bg-white rounded-[10px] p-2 overflow-y-auto">
          {community?.length > 0
            ? community.map((item, index) => (
                <div
                  key={index}
                  className="w-xs h-[320px] relative rounded-[10px] border-none"
                >
                  <div
                    className={`absolute p-2 flex items-end w-full h-full backdrop-blur-sm rounded-[10px] hover:backdrop-brightness-50 hover:bg-black/35 hover:opacity-100 opacity-0 transition-all z-[1]`}
                  >
                    <h2 className="text-white text-[12px] max-w-[255px] capitalize">
                      {item.prompt}
                    </h2>
                  </div>
                  <img
                    src={item.content}
                    alt="Image"
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                  <div className="absolute flex gap-2 bottom-1 right-1 z-10">
                    <div className="text-[15px] text-white">
                      {item.likes.length}
                    </div>
                    <Heart
                      className={`text-[15px]  cursor-pointer transition-all ${
                        item.likes.find((e) => e === user?.id)
                          ? "text-red-700 fill-red-700"
                          : "text-white"
                      }`}
                      onClick={() => handleLike(item.creation_id, item.likes)}
                    />
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </>
  );
};

export default Community;
