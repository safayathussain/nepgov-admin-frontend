"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CrimesTab from "@/components/page/crime/CrimesTab";
import TypesTab from "@/components/page/crime/TypesTab";
import Tabs from "@/components/page/email/Tabs";

const CrimePage = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("crimes");

  const tabs = [
    { label: "Crimes", value: "crimes" },
    { label: "Types", value: "types" },
  ];

  useEffect(() => {
    const tab = searchParams.get("tab") || "crimes";
    setActiveTab(tab);
  }, [searchParams]);

  return (
    <div className="container">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} basePath={"/crimes"}/>
      <div className="mt-4">
        {activeTab === "crimes" && <CrimesTab />}
        {activeTab === "types" && <TypesTab />}
      </div>
    </div>
  );
};

export default CrimePage;