import Table from "@/components/common/Table";
import React from "react";

const page = () => {
  const data = [
    { id: 1, name: "John Doe", age: 9, email: "john@example.com" },
    {
      id: 2,
      name: "safayat2 Doe",
      age: 0,
      email: "safayat1 3 121 312443 23 3@example.com",
    },
    { id: 3, name: "John Doe", age: 98, email: "john@example.com" },
    { id: 4, name: "John Doe", age: 6, email: "john@example.com" },
    { id: 5, name: "John Doe", age: 8, email: "john@example.com" },
    { id: 6, name: "John Doe", age: 4, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
    { id: 7, name: "John Doe", age: 5, email: "john@example.com" },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "email", label: "Email" },
  ];
  return (
    <div className="w-full">
      <Table
        data={data}
        columns={columns}
        searchableColumns={["name", "email"]}
      />
    </div>
  );
};

export default page;
