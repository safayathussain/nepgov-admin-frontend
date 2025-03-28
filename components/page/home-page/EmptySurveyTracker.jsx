import SurveyStatus from "@/components/common/SurveyStatus";
import TrackerStatus from "@/components/common/TrackerStatus";
import ArticleStatus from "@/components/common/ArticleStatus"; // Import ArticleStatus
import React from "react";

const EmptySurveyTracker = ({
  onClick,
  type,
  showStatus = true,
  height = 300,
}) => {
  return (
    <div
      className={`relative cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white hover:border-gray-400`}
      onClick={onClick}
      style={{
        height: height + "px",
      }}
    >
      {showStatus && (
        <div className="absolute top-4 left-4">
          <span>
            {type === "SURVEY" ? (
              <SurveyStatus />
            ) : type === "TRACKER" ? (
              <TrackerStatus />
            ) : (
              <ArticleStatus /> // Use ArticleStatus for ARTICLE type
            )}
          </span>
        </div>
      )}

      <div
        className={`flex items-center justify-center h-full`}
        style={{
          height: height + "px",
        }}
      >
        <div className="rounded-full p-3 bg-gray-100 group-hover:bg-gray-200 transition-colors">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EmptySurveyTracker;