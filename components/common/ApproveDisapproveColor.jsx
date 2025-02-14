import React from "react";

const ApproveDisapproveColor = () => {
  return (
    <div className="flex items-center flex-wrap gap-3 mt-2">
      <div className="flex items-center gap-2">
        <div className="size-4 bg-success"></div>
        <p>Approve</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="size-4 bg-error"></div>
        <p>Disapprove</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="size-4 bg-warning"></div>
        <p>Neutral</p>
      </div>
    </div>
  );
};

export default ApproveDisapproveColor;
