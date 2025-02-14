"use client";

import Table from "@/components/common/Table";
import Button from "@/components/input/Button";
import Modal from "@/components/modal/Modal";
import { formatDate } from "@/utils/functions";
import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";

const DailyQuestion = ({ trackers, selectedTracker, onSelectTracker }) => {
  const [showSelectModal, setShowSelectModal] = useState(false);

  const columns = [
    { key: "topic", label: "Topic" },
    { key: "createdAt", label: "Created At" },
    { key: "action", label: "Action" },
  ];

  const data = trackers.map((tracker) => ({
    _id: tracker._id,
    topic: tracker.topic,
    createdAt: formatDate(tracker.createdAt),
    action: (
      <Button
        onClick={() => onSelectTracker(tracker)}
        disabled={selectedTracker?._id === tracker._id}
      >
        {selectedTracker?._id !== tracker._id ? "Select" : "Selected"}
      </Button>
    ),
  }));

  return (
    <div>
      <p className="text-xl font-medium">Daily Question</p>
      {showSelectModal && (
        <Modal setOpen={setShowSelectModal} className={"max-w-[800px] w-full"}>
          <Table
            tableClassName="lg:w-full"
            columns={columns}
            data={data}
            showAddButton={false}
            searchableColumns={["topic"]}
          />
        </Modal>
      )}
      {selectedTracker ? (
        <div className="bg-gradiantBg2 p-5 mt-2 flex flex-col justify-between w-full gap-8 text-white max-w-[500px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p>Daily Question</p>
              <p className="flex items-center gap-2">
                Live <GoDotFill />
              </p>
            </div>
            <p className="text-xl font-semibold">{selectedTracker.topic}</p>
          </div>
          <button
            onClick={() => setShowSelectModal(true)}
            className="w-full bg-white text-secondary font-semibold rounded-full py-2"
          >
            Change Tracker
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-gradiantBg2 p-5 mt-2 flex flex-col justify-between w-full gap-8 text-white max-w-[500px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p>Daily Question</p>
                <p className="flex items-center gap-2">
                  Live <GoDotFill />
                </p>
              </div>
              <p className="text-xl font-semibold">No Tracker Selected</p>
            </div>
            <button
              onClick={() => setShowSelectModal(true)}
              className="w-full bg-white text-secondary font-semibold rounded-full py-2"
            >
              Select Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuestion;
