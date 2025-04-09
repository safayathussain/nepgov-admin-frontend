"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";

const CategoryTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <Link href={`/email/category/${row._id}`} className="text-blue-600 hover:underline">
          {row.name}
        </Link>
      ),
    },
    { key: "templateCount", label: "Template Count" }, // Ensure this matches the data
    { key: "createdAt", label: "Created At" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await FetchApi({ url: "/email-category" });
        if (response?.data?.success) {
          const formattedCategories = response.data.data.map((item) => ({
            _id: item._id,
            name: item.name,
            templateCount: item.templateCount ?? 0, // Fallback to 0 if undefined
            createdAt: formatDate(item.createdAt),
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      <Table
        data={categories}
        columns={columns}
        searchableColumns={["name"]}
        loading={loading}
        showAddButton={true}
        addButtonLink="/email/category/add"
        _idLink={"/email/category"}
      />
    </div>
  );
};

export default CategoryTab;