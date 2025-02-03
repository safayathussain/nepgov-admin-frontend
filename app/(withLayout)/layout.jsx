"use client";
import SideBar from "@/components/common/SideBar";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const layout = ({ children }) => {
  const params = usePathname();
  return (
    <div className="flex overflow-x-hidden">
      <div className="absolute lg:fixed">
        <SideBar />
      </div>
      <div className="lg:ml-[260px] lg:p-10 p-5 mt-10 lg:mt-0">
        <p className="capitalize text-2xl font-medium hidden lg:block">
          {params.split("/")[1]?.replace("-", " ")}
        </p>
        <div className=" mt-10">{children}</div>
      </div>
    </div>
  );
};

export default layout;
