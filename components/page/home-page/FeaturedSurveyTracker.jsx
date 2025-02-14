"use client";

import Link from "next/link";
import Image from "next/image";
import Table from "@/components/common/Table";
import Button from "@/components/input/Button";
import Modal from "@/components/modal/Modal";
import { formatDate } from "@/utils/functions";
import React, { useState } from "react";
import ApproveDisapproveColor from "@/components/common/ApproveDisapproveColor";
import EmptySurveyTracker from "./EmptySurveyTracker";
import SimpleChart from "@/components/chart/SimpleChart";
import SurveyStatus from "@/components/common/SurveyStatus";
import TrackerStatus from "@/components/common/TrackerStatus";

const FeaturedSurveyTracker = ({
  trackers,
  surveys,
  selectedSurvey,
  selectedTrackers,
  onSelectSurvey,
  onSelectTrackers,
}) => {
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showTrackerModal, setShowTrackerModal] = useState(false);

  return (
    <div>
      <p className="text-xl font-medium">Featured Survey And Tracker</p>
      <div className="max-w-[1440px] mt-2">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:w-2/3 h-full">
            {selectedSurvey ? (
              <div className="border">
                <Link href={`/surveys/${selectedSurvey._id}`}>
                  <Image
                    src="https://i.ibb.co/0rm95Dk/7dfd2d98ea5bcaefbb081aabbbb76ade.jpg"
                    width={874}
                    height={364}
                    alt=""
                    className="w-full"
                  />
                  <div className="p-5 space-y-2">
                    <SurveyStatus />
                    <p className="text-2xl md:text-3xl font-semibold">
                      {selectedSurvey.topic}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatDate(selectedSurvey.createdAt)}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <EmptySurveyTracker
                onClick={() => setShowSurveyModal(true)}
                type="SURVEY"
                className="shadow-light border border-[#EBEBEB]"
              />
            )}
          </div>
          <div className="flex flex-col gap-5 lg:w-1/3">
            {selectedTrackers.length > 0
              ? selectedTrackers.map((tracker) => (
                  <Link
                    key={tracker._id}
                    href={`/trackers/${tracker._id}`}
                    className="p-4 shadow-light border border-[#EBEBEB] flex flex-col justify-between gap-5"
                  >
                    <div>
                      <div className="flex justify-between">
                        <TrackerStatus />
                        <p className="text-lightGray">
                          {tracker.categories[0]?.name}
                        </p>
                      </div>
                      <p className="text-xl font-semibold">{tracker.topic}</p>
                      <ApproveDisapproveColor />
                    </div>
                    <div>
                      <SimpleChart height={190} />
                    </div>
                  </Link>
                ))
              : Array(2)
                  .fill(null)
                  .map((_, index) => (
                    <EmptySurveyTracker
                      onClick={() => setShowTrackerModal(true)}
                      key={index}
                      type="TRACKER"
                      className="shadow-light border border-[#EBEBEB]"
                    />
                  ))}
          </div>
        </div>
        <div className="mt-5 flex gap-4">
          <Button onClick={() => setShowSurveyModal(true)}>Select Survey</Button>
          <Button onClick={() => setShowTrackerModal(true)}>
            Select Trackers
          </Button>
        </div>
      </div>

      {/* Survey Modal */}
      {showSurveyModal && (
        <Modal setOpen={setShowSurveyModal} className="max-w-[800px] w-full">
          <p className="text-xl font-medium">Select Survey</p>
          <Table
            tableClassName="lg:w-full mt-4"
            columns={[{ key: "topic", label: "Survey Topic" }, { key: "action", label: "Action" }]}
            data={surveys.map((survey) => ({
              ...survey,
              action: (
                <Button
                  variant={selectedSurvey?._id !== survey._id ? "primary" : "secondary"}
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
      )}

      {/* Tracker Modal */}
      {showTrackerModal && (
        <Modal setOpen={setShowTrackerModal} className="max-w-[800px] w-full">
          <p className="text-xl font-medium">Select Trackers (Max 2)</p>
          <Table
            tableClassName="lg:w-full mt-4"
            columns={[{ key: "topic", label: "Tracker Topic" }, { key: "action", label: "Action" }]}
            data={trackers.map((tracker) => ({
              ...tracker,
              action: (
                <Button
                  onClick={() => onSelectTrackers(tracker)}
                >
                  {selectedTrackers.some((t) => t._id === tracker._id) ? "Remove" : "Select"}
                </Button>
              ),
            }))}
            showAddButton={false}
            searchableColumns={["topic"]}
          />
        </Modal>
      )}
    </div>
  );
};

export default FeaturedSurveyTracker;
