import React from "react";

const Button = ({ className, children,...props }) => {
  return (
    <button {...props} className={`px-4 py-2 bg-[var(--highlight)] flex justify-between items-center gap-4 rounded-4xl cursor-pointer text-white ${className}`}>
      {children}
    </button>
  );
};

export default Button;
