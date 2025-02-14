"use client"
import React, { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate, isLive } from "@/utils/functions";

const SurveyTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { key: "topic", label: "Topic" },
    { key: "questionsCount", label: "Questions" },
    { key: "totalOptions", label: "Total Options" },
    { key: "categories", label: "Categories" },
    { key: "totalVotes", label: "Total Votes" },
    { key: "createdAt", label: "Created At" },
    { key: "liveEndedAt", label: "Live Ended At" },
    { key: "status", label: "Status" },
  ];

  useEffect(() => {
    const fetchSurveys = async () => {
      const response = await FetchApi({ url: "/survey" });

      if (response?.data?.success) {
        const formattedData = response.data.data.map((item) => {
          const totalVotes = item.questions.reduce((sum, question) => {
            return sum + question.options.reduce((optSum, opt) => optSum + opt.votedCount, 0);
          }, 0);

          const totalOptions = item.questions.reduce((sum, question) => {
            return sum + question.options.length;
          }, 0);

          return {
            _id: item._id,
            topic: item.topic,
            questionsCount: item.questions.length,
            totalOptions,
            categories: item.categories.map((category) => category.name).join(", "),
            totalVotes,
            liveEndedAt: formatDate(item.liveEndedAt),
            createdAt: formatDate(item.createdAt),
            status: isLive(item.liveEndedAt) ? <div className="text-secondary font-bold">Live</div>: <div className="text-success font-bold">Ended</div>,
            questions: item.questions
          };
        });

        setData(formattedData);
      }
    };

    fetchSurveys();
  }, []);
 

  return (
        <Table
          showLiveStatus={true}
          data={data}
          columns={columns}
          searchableColumns={["topic", "categories"]}
        />
  );
};

export default SurveyTable;