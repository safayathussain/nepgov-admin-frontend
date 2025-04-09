"use client";

import { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";

const LogTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "template", label: "Template", render: (row) => row.template || "N/A" },
    { key: "recipient", label: "Recipient", render: (row) => row.recipient || "N/A" },
    { key: "status", label: "Status" },
    { key: "errorMessage", label: "Error", render: (row) => row.errorMessage || "N/A" },
    { key: "createdAt", label: "Sent At" },
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await FetchApi({ url: "/email-log" });
        if (response?.data?.success) {
          const formattedLogs = response.data.data.map((item) => ({
            _id: item.template?._id,
            template: item.template?.name,
            recipient: item.recipient?.email,
            status: item.status,
            errorMessage: item.errorMessage,
            createdAt: formatDate(item.createdAt),
          }));
          setLogs(formattedLogs);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="w-full">
      <Table
        data={logs}
        columns={columns}
        searchableColumns={["status"]}
        loading={loading}
        showAddButton={false}
        _idLink={"/email/tamplate"}
      />
    </div>
  );
};

export default LogTab;