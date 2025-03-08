"use client";
import SideBar from "@/components/common/SideBar";
import { logout, useAuth } from "@/utils/functions";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/").filter(Boolean);
  const { auth } = useAuth();
  useEffect(() => {
    if (auth?.role !== "admin") {
      if(auth?.role){
        logout()
      }
      return router.push("/");
    }
    if (auth?.accessToken) {
      const decoded = jwtDecode(auth.accessToken);
      if (!decoded?.exp || decoded?.exp * 1000 < Date.now()) {
        logout();
      }
    }
  }, []);

  return (
    <div className="flex overflow-x-hidden">
      {auth?.role === "admin" && (
        <>
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
        </>
      )}
    </div>
  );
};

export default Layout;
