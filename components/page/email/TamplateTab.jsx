"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";

const TemplateTab = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    { key: "subject", label: "Subject" },
    {
      key: "category",
      label: "Category",
    },
    { key: "createdAt", label: "Created At" },
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await FetchApi({ url: "/email-template" });
        if (response?.data?.success) {
          const formattedTemplates = response.data.data.map((item) => ({
            _id: item._id,
            name: item.name,
            subject: item.subject,
            category: item.category.name,
            createdAt: formatDate(item.createdAt),
          }));
          setTemplates(formattedTemplates);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);
  return (
    <div className="w-full">
      <Table
        data={templates}
        columns={columns}
        searchableColumns={["name", "subject"]}
        loading={loading}
        showAddButton={true}
        addButtonLink="/email/template/add"
        _idLink="/email/tamplate"
      />
    </div>
  );
};

export default TemplateTab;
