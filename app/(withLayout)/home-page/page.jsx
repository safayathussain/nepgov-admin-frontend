"use client";

import { useEffect, useState } from "react";
import Button from "@/components/input/Button";
import DailyQuestion from "@/components/page/home-page/DailyQuestion";
import FeaturedSurveyTracker from "@/components/page/home-page/FeaturedSurveyTracker";
import LiveSurveyTracker from "@/components/page/home-page/LiveSurveyTracker";
import { FetchApi } from "@/utils/FetchApi";
import { ProgressSpinner } from "primereact/progressspinner";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [trackers, setTrackers] = useState([]);
  const [surveys, setSurveys] = useState([]);

  // State for DailyQuestion component
  const [selectedTracker, setSelectedTracker] = useState(null);

  // State for FeaturedSurveyTracker component
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedTrackers, setSelectedTrackers] = useState([]);

  // State for LiveSurveyTracker component
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const homePageResponse = await FetchApi({ url: "/home-page" });
        if (homePageResponse?.data?.success) {
          const { data } = homePageResponse.data;
          if (data.hero?.dailyQuestion) {
            setSelectedTracker(data.hero.dailyQuestion);
          }
          if (data.featuredSurveyTracker) {
            if (data.featuredSurveyTracker.surveys?.length > 0) {
              setSelectedSurvey(data.featuredSurveyTracker.surveys[0]);
            }
            setSelectedTrackers(data.featuredSurveyTracker.trackers || []);
          }
          if (data.liveSurveyTracker) {
            const items = data.liveSurveyTracker.map((item) => ({
              ...item.data,
              type: item.type,
            }));
            setSelectedItems(items);
          }
        }

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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
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
      setSelectedTrackers(
        selectedTrackers.filter((t) => t._id !== tracker._id)
      );
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

  const handleSaveHomePage = async () => {
    const homePageData = {
      hero: {
        dailyQuestion: selectedTracker?._id || null,
      },
      featuredSurveyTracker: {
        surveys: selectedSurvey ? [selectedSurvey._id] : [],
        trackers: selectedTrackers.map((t) => t._id),
      },
      liveSurveyTracker: selectedItems.map((item) => ({
        data: item._id,
        type: item.type,
      })),
    };

    const response = await FetchApi({
      url: "/home-page/update",
      method: "put",
      data: homePageData,
      isToast: true,
    });
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <ProgressSpinner className="border-lightGray" />
        </div>
      </div>
    );
  }

  return (
    <div>
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
        <Button onClick={handleSaveHomePage} disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          ) : (
            "Save Home Page"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Page;
