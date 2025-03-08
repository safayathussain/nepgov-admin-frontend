"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate, getLiveStatus } from "@/utils/functions";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "topic", label: "Topic" },
    { key: "options", label: "Options" },
    { key: "categories", label: "Categories" },
    { key: "votedCount", label: "Vote count" },
    { key: "createdAt", label: "Created At" },
    { key: "liveStartedAt", label: "Live Started At" },
    { key: "liveEndedAt", label: "Live Ended At" },
    { key: "status", label: "Status" },
  ];

  useEffect(() => {
    const fetchTrackers = async () => {
      setLoading(true);
      const response = await FetchApi({ url: "/tracker" });

      if (response?.data?.success) {
        const formattedData = response.data.data.map((item) => ({
          _id: item._id,
          topic: item.topic,
          user: item.user,
          options: item.options.map((option) => option.content).join(", "),
          liveEndedAt: formatDate(item.liveEndedAt),
          liveStartedAt: formatDate(item.liveStartedAt),
          createdAt: formatDate(item.createdAt),
          categories: item.categories
            .map((category) => category.name)
            .join(", "),
          votedCount: item.votedCount,
          status: (() => {
            const { className, label } = getLiveStatus(
              item.liveStartedAt,
              item.liveEndedAt
            );
            return <div className={`${className} font-bold`}>{label}</div>;
          })(),
        }));

        setData(formattedData);
      }
      setLoading(false);
    };

    fetchTrackers();
  }, []);

  return (
    <div className="w-full">
      <Table
        showLiveStatus={true}
        data={data}
        columns={columns}
        searchableColumns={["topic","categories"]}
        loading={loading}
      />
    </div>
  );
};

export default Page;
