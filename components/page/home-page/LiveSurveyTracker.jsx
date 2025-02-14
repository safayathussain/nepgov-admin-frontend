"use client";
import Table from "@/components/common/Table";
import Button from "@/components/input/Button";
import Modal from "@/components/modal/Modal";
import React, { useEffect, useState } from "react";
import EmptySurveyTracker from "./EmptySurveyTracker";
import SurveyStatus from "@/components/common/SurveyStatus";
import TrackerStatus from "@/components/common/TrackerStatus";

const LiveSurveyTracker = ({ trackers, surveys, selectedItems, onSelectItems }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("surveys");

  const ItemCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-sm border flex flex-col justify-between border-gray-100 p-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-5">
          {item.type === "survey" ? <SurveyStatus /> : <TrackerStatus />}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {item?.categories?.[0]?.name}
        </span>
      </div>
      <h3 className="text-lg font-medium mb-4">{item.topic}</h3>
      <Button
        variant={
          item?.type === "survey" ? "primary-outline" : "secondary-outline"
        }
        className={"w-full !rounded-full"}
      >
        Vote Now
      </Button>
    </div>
  );

  return (
    <div className="max-w-[1440px]   ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedItems.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}

        <EmptySurveyTracker
          onClick={() => setShowModal(true)}
          showStatus={false}
          className="shadow-sm border border-gray-100 rounded-lg"
          height={200}
        />
      </div>
 

      {showModal && (
        <Modal setOpen={setShowModal} className="max-w-[800px] w-full">
          <div className="flex gap-4 border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === "surveys"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("surveys")}
            >
              Surveys
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "trackers"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("trackers")}
            >
              Trackers
            </button>
          </div>
          <Table
            tableClassName="lg:w-full mt-4"
            columns={[
              {
                key: "topic",
                label: `${
                  activeTab === "surveys" ? "Survey" : "Tracker"
                } Topic`,
              },
              { key: "action", label: "Action" },
            ]}
            data={[
              ...trackers.map((item) => ({...item,type : "tracker"})),
              ...surveys.map((item) => ({...item,type : "survey"})),
            ]
              .filter((item) =>
                activeTab === "surveys"
                  ? item.type === "survey"
                  : item.type === "tracker"
              )
              .map((item) => ({
                ...item,
                action: (
                  <Button
                    onClick={() => onSelectItems(item)}
                    variant={
                      !selectedItems.some((i) => i._id === item._id)
                        ? "primary"
                        : "secondary"
                    }
                  >
                    {!selectedItems.some((i) => i._id === item._id)
                      ? "Select"
                      : "Remove"}
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

export default LiveSurveyTracker;
