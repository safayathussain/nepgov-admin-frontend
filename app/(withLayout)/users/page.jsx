"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/common/Table";
import { FetchApi } from "@/utils/FetchApi";
import { formatDate } from "@/utils/functions"; // Ensure the formatDate function is defined

const Page = () => {
  const [data, setData] = useState([]);

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "dob", label: "Birth" },
    { key: "gender", label: "Gender" },
    { key: "city", label: "City" },
    { key: "postCode", label: "Post Code" },
    { key: "createdAt", label: "Created At" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await FetchApi({ url: "/user" });

      if (response?.data?.success) {
        const formattedData = response.data.data.map((item) => ({
          _id: item._id,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          dob: item.dob,
          gender: item.gender,
          city: item.city,
          postCode: item.postCode,
          createdAt: formatDate(item.createdAt),
          profilePicture: item.profilePicture
            ? `/uploads/${item.profilePicture}`
            : "/default-avatar.png",
        }));

        setData(formattedData);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full">
      <Table
        data={data}
        columns={columns}
        searchableColumns={["firstName", "lastName", "email", "city", "dob", "postCode"]}
      />
    </div>
  );
};

export default Page;
