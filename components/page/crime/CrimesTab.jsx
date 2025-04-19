"use client";

import { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions";

const CrimesTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "crimeType", label: "Crime Type" },
    { key: "location", label: "Location" },
    { key: "time", label: "Time" },
    { key: "hasVehicle", label: "Has Vehicle" },
    { key: "hasWeapon", label: "Has Weapon" },
    { key: "createdAt", label: "Reported At" },
    { key: "crimeDetails", label: "Crime Details" },
  ];

  const getRowColor = (item) => {
    if (!item.isSeenByAdmin) return "bg-red-200";
    return "bg-white";
  };

  useEffect(() => {
    const fetchCrimeReports = async () => {
      setLoading(true);
      const response = await FetchApi({ url: "/crime" });
      if (response?.data?.success) {
        const formattedData = response.data.data.map((item) => ({
          _id: item._id,
          crimeType: item.crimeType?.type || "Unknown",
          location: item.location,
          time: item?.time ? formatDate(item.time) : "Not provided",
          crimeDetails: item.crimeDetails,
          hasVehicle: item.hasVehicle,
          hasWeapon: item.hasWeapon,
          createdAt: formatDate(item.createdAt),
          isSeenByAdmin: item.isSeenByAdmin,
        }));

        setData(formattedData);
      }
      setLoading(false);
    };

    fetchCrimeReports();
  }, []);

  return (
    <div className="w-full">
      <Table
        showAddButton={false}
        data={data}
        columns={columns}
        searchableColumns={["crimeType", "location"]}
        getRowColor={getRowColor}
        loading={loading}
      />
    </div>
  );
};

export default CrimesTab;