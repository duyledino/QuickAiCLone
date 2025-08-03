import React from "react";
import { assets, dummyTestimonialData } from "../assets/assets";

const LoveByCreators = () => {
  return (
    <div className="container mx-auto my-32 w-full flex flex-col  justify-center items-center gap-5">
      <h1 className="text-6xl text-black font-extrabold">Powerful AI Tools</h1>
      <h2 className="text-gray-500 max-w-[600px] text-center">
        Everything you need to create, enhance, and optimize your content with
        cutting-edge AI technology.
      </h2>
      <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-8">
        {dummyTestimonialData.map(
          ({ image, title, content, rating,name }, index) => (
            <div className=" lg:w-[300px] w-full h-fit max-h-80 flex flex-col items-center p-10 gap-5 rounded-xl shadow-[-5px_5px_20px_rgba(0,0,0,0.3)] transition-all hover:translate-y-[-10px]">
              <div key={index} className="w-full flex gap-3">
                {Array.from({length: rating},(item,index)=>index).map((item,index)=>(
                    <img src={assets.star_icon} alt="star" key={index}/>
                ))}
                {Array.from({length: 5 - rating},(item,index)=>index).map((item,index)=>(
                    <img src={assets.star_dull_icon} alt="dull_star" key={index*4}/>
                ))}
              </div>
              <p className="text-gray-500 text-[12px]">"{content}"</p>
              <div className="w-full h-[1px] bg-gray-300 rounded-4xl"></div>
              <div className="w-full flex gap-2 items-center">
                <img src={image} alt="" className="w-12 h-12" />
                <div className="flex flex-col gap-2">
                    <p className="text-gray-900 text-[12px] font-semibold">{name}</p>
                    <p className="text-gray-500 text-[10px]">{title}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LoveByCreators;
