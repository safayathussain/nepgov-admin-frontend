"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = useCallback(
    (tab) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      router.push(`/email?${params.toString()}`);
      onTabChange(tab);
    },
    [router, searchParams, onTabChange]
  );

  return (
    <div className="flex border-b border-gray-200 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabChange(tab.value)}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === tab.value
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;