"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);

  const columns = [
    { key: "title", label: "Title" },
    { key: "categories", label: "Category" },
    { key: "createdAt", label: "Created At" },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setloading(true);
      const response = await FetchApi({ url: "/article" });

      if (response?.data?.success) {
        const formattedData = response.data.data.map((item, index) => ({
          _id: item._id,
          title: item.title,
          categories: item.categories.map((cat) => cat.name).join(", "),
          createdAt: formatDate(item.createdAt),
        }));

        setData(formattedData);
      }
      setloading(false);
    };

    fetchArticles();
  }, []);

  return (
    <div className="w-full">
      <Table
        loading={loading}
        data={data}
        columns={columns}
        searchableColumns={["title", "categories"]}
      />
    </div>
  );
};

export default Page;
