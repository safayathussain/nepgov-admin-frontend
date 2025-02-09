"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";  

const Page = () => {
  const [data, setData] = useState([]);

  const columns = [
    { key: "title", label: "Page Title" },
    { key: "page", label: "Page Slug" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Last Updated At" },
  ];

  useEffect(() => {
    const fetchStaticPages = async () => {
      const response = await FetchApi({ url: "/static-page" });

      if (response?.data?.success) {
        const formattedData = response.data.data.map((item) => ({
          _id: item._id,
          title: item.title,
          page: item.page,
          createdAt: formatDate(item.createdAt),  
          updatedAt: formatDate(item.updatedAt),  
        }));

        setData(formattedData);
      }
    };

    fetchStaticPages();
  }, []);

  return (
    <div className="w-full">
      <Table
        data={data}
        columns={columns}
        searchableColumns={["title", "page"]}
      />
    </div>
  );
};

export default Page;
