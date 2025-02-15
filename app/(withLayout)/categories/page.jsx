"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "name", label: "Category Name" },
    { key: "surveysCount", label: "Surveys Count" },
    { key: "trackersCount", label: "Trackers Count" },
    { key: "articleCount", label: "Articles Count" },
    { key: "createdAt", label: "Created At" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const response = await FetchApi({ url: "/category" });

      if (response?.data?.success) {
        const formattedData = response.data.data.map((item) => ({
          _id: item._id,
          name: item.name,
          surveysCount: item.surveysCount,
          trackersCount: item.trackersCount,
          articleCount: item.articleCount,
          createdAt: formatDate(item.createdAt),
        }));

        setData(formattedData);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      <Table
        data={data}
        columns={columns}
        searchableColumns={["name"]}
        loading={loading}
      />
    </div>
  );
};

export default Page;
