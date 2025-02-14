"use client";

import Button from "@/components/input/Button";
import DailyQuestion from "@/components/page/home-page/DailyQuestion";
import FeaturedSurveyTracker from "@/components/page/home-page/FeaturedSurveyTracker";
import LiveSurveyTracker from "@/components/page/home-page/LiveSurveyTracker";
import { FetchApi } from "@/utils/FetchApi";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [trackers, setTrackers] = useState([]);
  const [surveys, setSurveys] = useState([]);

  // State for DailyQuestion component
  const [selectedTracker, setSelectedTracker] = useState(null);

  // State for FeaturedSurveyTracker component
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedTrackers, setSelectedTrackers] = useState([]);

  // State for LiveSurveyTracker component
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const [trackerResponse, surveyResponse] = await Promise.all([
        FetchApi({ url: "/tracker" }),
        FetchApi({ url: "/survey" }),
      ]);

      if (trackerResponse?.data?.success) {
        setTrackers(trackerResponse.data.data);
      }
      if (surveyResponse?.data?.success) {
        setSurveys(surveyResponse.data.data);
      }
    };

    fetchData();
  }, []);

  // Handler for selecting a tracker in DailyQuestion
  const handleSelectTracker = (tracker) => {
    setSelectedTracker(tracker);
  };

  // Handler for selecting a survey in FeaturedSurveyTracker
  const handleSelectSurvey = (survey) => {
    setSelectedSurvey(survey);
  };

  // Handler for selecting trackers in FeaturedSurveyTracker
  const handleSelectTrackers = (tracker) => {
    if (selectedTrackers.some((t) => t._id === tracker._id)) {
      setSelectedTrackers(selectedTrackers.filter((t) => t._id !== tracker._id));
    } else if (selectedTrackers.length < 2) {
      setSelectedTrackers([...selectedTrackers, tracker]);
    }
  };

  // Handler for selecting items in LiveSurveyTracker
  const handleSelectItems = (item) => {
    if (selectedItems.some((i) => i._id === item._id)) {
      setSelectedItems(selectedItems.filter((i) => i._id !== item._id));
    } else if (selectedItems.length < 4) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div>
      {/* Pass state and handlers as props to child components */}
      <DailyQuestion
        trackers={trackers}
        selectedTracker={selectedTracker}
        onSelectTracker={handleSelectTracker}
      />
      <hr className="my-5" />
      <FeaturedSurveyTracker
        trackers={trackers}
        surveys={surveys}
        selectedSurvey={selectedSurvey}
        selectedTrackers={selectedTrackers}
        onSelectSurvey={handleSelectSurvey}
        onSelectTrackers={handleSelectTrackers}
      />
      <hr className="my-5" />
      <LiveSurveyTracker
        trackers={trackers}
        surveys={surveys}
        selectedItems={selectedItems}
        onSelectItems={handleSelectItems}
      />
      <div className="mt-5">
        <Button >Save Home Page</Button>
      </div>
    </div>
  );
};

export default Page;