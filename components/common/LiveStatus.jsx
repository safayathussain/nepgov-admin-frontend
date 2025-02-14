import React from "react";
import { GoDotFill } from "react-icons/go";

const LiveStatus = () => {
  return (
    <div>
      {" "}
      <p className="flex items-center ">
        Live <GoDotFill className="text-error text-3xl" />
      </p>
    </div>
  );
};

export default LiveStatus;
