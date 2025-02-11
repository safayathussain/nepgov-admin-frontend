"use client";
import SideBar from "@/components/common/SideBar";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/").filter(Boolean); // Removes empty strings

  return (
    <div className="flex overflow-x-hidden">
      <div className="absolute lg:fixed">
        <SideBar />
      </div>
      <div className="lg:ml-[260px] lg:p-10 p-5 mt-10 lg:mt-0 w-full">
        <div className="flex items-center gap-2">
          {/* Show back button only if there's more than one segment (e.g., /articles/:id) */}
          {pathSegments.length > 1 && (
            <button onClick={() => router.back()}>
              <IoArrowBackOutline size={25} />
            </button>
          )}
          <p className="capitalize text-2xl font-medium hidden lg:block">
            {pathSegments[0]?.replace("-", " ")}
          </p>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
