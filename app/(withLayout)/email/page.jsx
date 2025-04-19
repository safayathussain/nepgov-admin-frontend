"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Tabs from "@/components/page/email/Tabs";
import SendTab from "@/components/page/email/SendTab";
import CategoryTab from "@/components/page/email/CategoryTab";
import TemplateTab from "@/components/page/email/TamplateTab";
import LogTab from "@/components/page/email/LogTab";

const EmailPage = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("send");

  const tabs = [
    { label: "Send", value: "send" },
    { label: "Category", value: "category" },
    { label: "Template", value: "template" },
    { label: "Log", value: "log" },
  ];

  useEffect(() => {
    const tab = searchParams.get("tab") || "send";
    setActiveTab(tab);
  }, [searchParams]);

  return (
    <div className="container  ">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} basePath={'/email'}/>
      <div className="mt-4">
        {activeTab === "send" && <SendTab />}
        {activeTab === "category" && <CategoryTab />}
        {activeTab === "template" && <TemplateTab />}
        {activeTab === "log" && <LogTab />}
      </div>
    </div>
  );
};

export default EmailPage;