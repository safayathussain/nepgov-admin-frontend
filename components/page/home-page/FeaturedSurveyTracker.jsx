"use client";

import Link from "next/link";
import Image from "next/image";
import Table from "@/components/common/Table";
import Button from "@/components/input/Button";
import Modal from "@/components/modal/Modal";
import { formatDate, isLive, timeAgo, timeLeft } from "@/utils/functions";
import React, { useState } from "react";
import EmptySurveyTracker from "./EmptySurveyTracker";
import SimpleChart from "@/components/chart/SimpleChart";
import SurveyStatus from "@/components/common/SurveyStatus";
import TrackerStatus from "@/components/common/TrackerStatus";
import OptionsWithColor from "@/components/common/OptionsWithColor";
import ArticleStatus from "@/components/common/ArticleStatus";

const FeaturedSurveyTracker = ({
  trackers,
  articles,
  surveys,
  selectedSurvey,
  selectedTrackers,
  selectedArticle,
  onSelectSurvey,
  onSelectTrackers,
  onSelectArticle,
}) => {
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);

  return (
    <div>
      <p className="text-xl font-medium">
        Featured Survey, Tracker, and Article
      </p>
      <div className="max-w-[1300px]">
        <div className="py-10">
          <div className="grid grid-cols-6 gap-5">
            {/* Selected Survey */}
            {/* {selectedSurvey ? (
              <Link
                href={`/surveys/${selectedSurvey?._id}`}
                className="shadow-light border col-span-6 flex flex-col md:flex-row items-center border-[#EBEBEB]"
              >
                <Image
                  src={
                    process.env.NEXT_PUBLIC_BASE_IMAGE_API +
                    selectedSurvey?.thumbnail
                  }
                  width={874}
                  height={364}
                  alt=""
                  className="w-full md:w-1/2 h-full aspect-video object-cover"
                />
                <div className="p-5 md:p-8 lg:p-12 space-y-3">
                  <SurveyStatus />
                  <p className="text-2xl md:text-4xl xl:text-5xl font-semibold">
                    {selectedSurvey.topic}
                  </p>
                  <p className="text-sm text-lightGray">
                    {isLive(
                      selectedSurvey?.liveStartedAt,
                      selectedSurvey?.liveEndedAt
                    )
                      ? timeLeft(selectedSurvey?.liveEndedAt)
                      : timeAgo(selectedSurvey?.liveEndedAt)}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="col-span-6">
                <EmptySurveyTracker
                  onClick={() => setShowSurveyModal(true)}
                  type="SURVEY"
                  className="shadow-light border border-[#EBEBEB] w-full h-full"
                />
              </div>
            )} */}

            {/* Selected Article */}
            {selectedArticle ? (
              <Link
                href={`/articles/${selectedArticle?._id}`}
                className="p-5 shadow-light border border-[#EBEBEB] flex flex-col  gap-5 col-span-6 lg:col-span-4 row-span-2"
              >
                <img
                  src={
                    process.env.NEXT_PUBLIC_BASE_IMAGE_API +
                    selectedArticle?.thumbnail
                  }
                  width={300}
                  height={150}
                  alt=""
                  className="w-full object-cover coverImage"
                />
                <div>
                  <div className="flex justify-between">
                    <ArticleStatus />
                    <p className="text-lightGray">
                      {selectedArticle.categories?.[0]?.name || "Uncategorized"}
                    </p>
                  </div>
                  <p className="text-3xl font-semibold mt-3">
                    {selectedArticle.title}
                  </p>
                </div>
                <p className=" text-lightGray ">
                  {selectedArticle.createdAt
                    ? timeAgo(selectedArticle.createdAt)
                    : "Published recently"}
                </p>
                <div
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  className="!line-clamp-3 text-lg -mt-2"
                ></div>
              </Link>
            ) : (
              <div className="p-5 shadow-light border border-[#EBEBEB] flex flex-col justify-between gap-5 col-span-6 lg:col-span-4 row-span-2">
                <EmptySurveyTracker
                  onClick={() => setShowArticleModal(true)}
                  type="ARTICLE"
                  className="w-full h-full"
                />
              </div>
            )}
            {/* Tracker Items */}
            {selectedTrackers.length > 0
              ? selectedTrackers.map((tracker) => (
                  <Link
                    key={tracker._id}
                    href={`/trackers/${tracker._id}`}
                    className="p-5 shadow-light border border-[#EBEBEB] flex flex-col justify-between gap-5 col-span-6 md:col-span-3 lg:col-span-2"
                  >
                    <div>
                      <div className="flex justify-between">
                        <TrackerStatus />
                        <p className="text-lightGray">
                          {tracker.categories[0]?.name}
                        </p>
                      </div>
                      <p className="text-xl font-semibold my-2">
                        {tracker.topic}
                      </p>
                      <OptionsWithColor options={tracker.options} />
                    </div>
                    <div className="-mt-5">
                      <SimpleChart />
                    </div>
                    <p className="text-sm text-lightGray">
                      {isLive(tracker?.liveStartedAt, tracker?.liveEndedAt)
                        ? timeLeft(tracker?.liveEndedAt)
                        : timeAgo(tracker?.liveEndedAt)}
                    </p>
                  </Link>
                ))
              : Array(2)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="p-5 shadow-light border border-[#EBEBEB] flex flex-col justify-between gap-5 col-span-6 md:col-span-3 lg:col-span-2"
                    >
                      <EmptySurveyTracker
                        onClick={() => setShowTrackerModal(true)}
                        type="TRACKER"
                        className="w-full h-full"
                      />
                    </div>
                  ))}
          </div>
        </div>
        <div className="mt-5 flex gap-4">
          {/* uncomment if survey added in future */}
          {/* <Button onClick={() => setShowSurveyModal(true)}>
            Select Survey
          </Button> */}
          <Button onClick={() => setShowArticleModal(true)}>
            Select Article
          </Button>
          <Button onClick={() => setShowTrackerModal(true)}>
            Select Trackers
          </Button>
        </div>
      </div>

      {/* Survey Modal */}
      {/* {showSurveyModal && (
        <Modal setOpen={setShowSurveyModal} className="max-w-[800px] w-full">
          <p className="text-xl font-medium">Select Survey</p>
          <Table
            tableClassName="lg:w-full mt-4"
            columns={[
              { key: "topic", label: "Survey Topic" },
              { key: "action", label: "Action" },
            ]}
            data={surveys.map((survey) => ({
              ...survey,
              action: (
                <Button
                  variant={
                    selectedSurvey?._id !== survey._id ? "primary" : "secondary"
                  }
                  onClick={() => onSelectSurvey(survey)}
                >
                  {selectedSurvey?._id === survey._id ? "Remove" : "Select"}
                </Button>
              ),
            }))}
            showAddButton={false}
            searchableColumns={["topic"]}
          />
        </Modal>
      )} */}

      {/* Tracker Modal */}
      {showTrackerModal && (
        <Modal setOpen={setShowTrackerModal} className="max-w-[800px] w-full">
          <p className="text-xl font-medium">Select Trackers (Max 2)</p>
          <Table
            tableClassName="lg:w-full mt-4"
            columns={[
              { key: "topic", label: "Tracker Topic" },
              { key: "action", label: "Action" },
            ]}
            data={trackers.map((tracker) => ({
              ...tracker,
              action: (
                <Button
                  variant={
                    !selectedTrackers.some((t) => t._id === tracker._id)
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => onSelectTrackers(tracker)}
                >
                  {selectedTrackers.some((t) => t._id === tracker._id)
                    ? "Remove"
                    : "Select"}
                </Button>
              ),
            }))}
            showAddButton={false}
            searchableColumns={["topic"]}
          />
        </Modal>
      )}

      {/* Article Modal */}
      {showArticleModal && (
        <Modal setOpen={setShowArticleModal} className="max-w-[800px] w-full">
          <p className="text-xl font-medium">Select Article</p>
          <Table
            tableClassName="lg:w-full mt-4"
            columns={[
              { key: "title", label: "Article Title" },
              { key: "action", label: "Action" },
            ]}
            data={articles.map((article) => ({
              ...article,
              action: (
                <Button
                  variant={
                    selectedArticle?._id !== article._id
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => onSelectArticle(article)}
                >
                  {selectedArticle?._id === article._id ? "Remove" : "Select"}
                </Button>
              ),
            }))}
            showAddButton={false}
            searchableColumns={["title"]}
          />
        </Modal>
      )}
    </div>
  );
};

export default FeaturedSurveyTracker;
