import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center h-full">
      <ClipLoader />
    </div>
  );
};

export default Loading;
