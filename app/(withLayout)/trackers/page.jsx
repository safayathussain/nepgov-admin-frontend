"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate, isLive } from "@/utils/functions";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "topic", label: "Topic" },
    { key: "options", label: "Options" },
    { key: "categories", label: "Categories" },
    { key: "votedCount", label: "Vote count" },
    { key: "createdAt", label: "Created At" },
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
          createdAt: formatDate(item.createdAt),
          categories: item.categories.map((category) => category.name).join(", "),
          votedCount: item.votedCount,
          status: isLive(item.liveEndedAt) ? <div className="text-secondary font-bold">Live</div> : <div className="text-success font-bold">Ended</div>,
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
        searchableColumns={["topic", "user", "categories"]}
        loading={loading}
      />
    </div>
  );
};

export default Page;
