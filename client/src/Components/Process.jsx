import React from "react";

const Process = ({ process }) => {
  return (
    <div className="w-full h-10 flex justify-center items-center relative bg-transparent rounded-[12px] ring-2 ring-gray-100 z-10">
      <h1 className={`text-xl text-white`}>
        {process}%
      </h1>
      <div
        className="absolute left-0 bg-[var(--highlight)] h-full -z-[1] rounded-[12px]"
        style={{
          width: `${process}%`,
        }}
      ></div>
    </div>
  );
};

export default Process;
