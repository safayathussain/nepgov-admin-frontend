"use client";

import React, { useState, useMemo } from "react";
import { 
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import TextInput from "../input/TextInput";
import Button from "../input/Button";
import { RiAddLine } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./Loading";

const Table = ({
  data = [],
  columns = [],
  itemsPerPage = 10,
  searchableColumns = [],
  showAddButton = true,
  tableClassName = "",
  loading = false,
  addButtonLink,
  _idLink,
  getRowColor = (item) => "bg-white", // Default row color function
  showCheckboxes = false, // New prop to control checkbox visibility
  onSelectionChange = () => {}, // Callback for selected rows
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]); // State to track selected rows
  const pathname = usePathname();
  const router = useRouter();

  const safeData = Array.isArray(data) ? data : [];

  // Sorting function
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return safeData;

    return [...safeData].sort((a, b) => {
      const valueA = a[sortConfig.key] ?? "";
      const valueB = b[sortConfig.key] ?? "";

      if (valueA < valueB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [safeData, sortConfig]);

  // Searching function
  const filteredData = useMemo(() => {
    const validSearchColumns =
      Array.isArray(searchableColumns) && searchableColumns.length
        ? searchableColumns
        : columns.map((col) => col.key);

    return sortedData.filter((item) =>
      validSearchColumns.some((column) =>
        String(item[column] ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm, searchableColumns, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Sorting handler
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle checkbox selection
  const handleCheckboxChange = (itemId) => {
    const updatedSelectedRows = selectedRows.includes(itemId)
      ? selectedRows.filter((id) => id !== itemId)
      : [...selectedRows, itemId];
    setSelectedRows(updatedSelectedRows);
    onSelectionChange(updatedSelectedRows); // Notify parent of selection change
  };

  // Handle select all checkboxes
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
      onSelectionChange([]);
    } else {
      const allIds = paginatedData.map((item) => item._id);
      setSelectedRows(allIds);
      onSelectionChange(allIds);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset current page if it becomes invalid
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mb-4 flex items-center gap-3">
        <div className="w-full">
          <TextInput
            type="text"
            placeholder={`Search by ${searchableColumns
              .map((col) => col.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase()))
              .join(", ")}`}
            
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={"w-full"}
          />
        </div>
        {showAddButton && (
          <Button
            onClick={() => {
              if (addButtonLink) {
                router.push(addButtonLink);
              } else {
                router.push(pathname + "/add");
              }
            }}
            className={"flex !pl-3 font-semibold py-2 items-center text-white"}
          >
            <RiAddLine fontWeight={800} size={25} /> Add
          </Button>
        )}
      </div>
      {loading ? (
        <div className="mt-20">
          <Loading />
        </div>
      ) : safeData.length === 0 ? (
        <div className="text-center p-4 text-gray-500">No data available</div>
      ) : (
        <>
          {/* Table */}
          <div className={`max-w-[1280px] overflow-x-auto ${tableClassName}`}>
            <table className="w-full border-collapse overflow-x-scroll">
              <thead>
                <tr>
                  {showCheckboxes && (
                    <th className="p-3 border bg-gray-100 text-left whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                        className="size-4"
                      />
                    </th>
                  )}
                  {columns.map(({ key, label, sortable = true, width }) => (
                    <th
                      key={key}
                      onClick={() => sortable && handleSort(key)}
                      style={{ width: width ? `${width}px` : "auto" }}
                      className={`p-3 border bg-gray-100 text-left whitespace-nowrap
                      ${sortable ? "cursor-pointer hover:bg-gray-200" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{label}</span>
                        {sortable && (
                          <div className="flex flex-col ml-2">
                            <FaSortUp
                              className={`size-[16px] ${
                                sortConfig.key === key &&
                                sortConfig.direction === "ascending"
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              }`}
                            />
                            <FaSortDown
                              className={`size-[16px] -mt-3 ${
                                sortConfig.key === key &&
                                sortConfig.direction === "descending"
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, rowIndex) => (
                  <tr key={rowIndex} className={`${getRowColor(item)}`}>
                    {showCheckboxes && (
                      <td className="p-3 border">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item._id)}
                          onChange={() => handleCheckboxChange(item._id)}
                        className="size-4"

                        />
                      </td>
                    )}
                    {columns.map(({ key, width }, colIndex) => (
                      <td
                        key={key}
                        style={{ width: width ? `${width}px` : "auto" }}
                        className="p-3 border max-w-[500px]"
                      >
                        {colIndex === 0 ? (
                          <a
                            href={`${_idLink ? _idLink : pathname}/${item?._id}`}
                            className="text-blue-600 underline"
                          >
                            {item[key] ?? "N/A"}
                          </a>
                        ) : (
                          item[key] ?? "N/A"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;