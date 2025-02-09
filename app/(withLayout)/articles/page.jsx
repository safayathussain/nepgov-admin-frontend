"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";

const Page = () => {
  const [data, setData] = useState([]);

  const columns = [
    { key: "title", label: "Title" },
    { key: "categories", label: "Category" },
    { key: "createdAt", label: "Created At" },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
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
    };

    fetchArticles();
  }, []);

  return (
    <div className="w-full">
      <Table
        data={data}
        columns={columns}
        searchableColumns={["title"]}
      />
    </div>
  );
};

export default Page;
