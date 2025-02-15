"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { useState } from "react";
import {
  FaBars,
} from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { FaHandcuffs } from "react-icons/fa6";
import { PiUsersLight } from "react-icons/pi";
import {
  RiArticleLine,
  RiPagesLine,
  RiSurveyLine,
} from "react-icons/ri";
import { MdOutlineWhereToVote } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { TbArticle } from "react-icons/tb";
import { IoClose, IoSettingsOutline } from "react-icons/io5";
import Button from "../input/Button";
import { logout } from "@/utils/functions";

const menuItems = [
  { icon: FaHandcuffs, label: "Crimes", href: "/crimes" },
  { icon: RiSurveyLine, label: "Surveys", href: "/surveys" },
  { icon: MdOutlineWhereToVote, label: "Trackers", href: "/trackers" },
  { icon: RiArticleLine, label: "Articles", href: "/articles" },
  { icon: BiCategory, label: "Categories", href: "/categories" },
  { icon: TbArticle, label: "Static Pages", href: "/static-pages" },
  { icon: RiPagesLine, label: "Home Page", href: "/home-page" },
  { icon: PiUsersLight, label: "Users", href: "/users" },
];

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Hamburger menu for mobile */}
      {!isSidebarOpen && (
        <div>
          <button
            className="  m-5  rounded-md lg:hidden flex items-center gap-3"
            onClick={toggleSidebar}
          >
            <FaBars size={24} />
            <p className="capitalize text-2xl font-medium">
              {pathname.split("/")[1]?.replace('-', ' ')}
            </p>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-64 bg-primary text-white
        transform transition-transform duration-300 ease-in-out z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
      `}
      >
        <div className="flex items-center justify-between p-4 py-6 border-b border-gray-300">
          <h2 className="text-2xl font-medium">NepGov Admin</h2>
          <button className="lg:hidden" onClick={toggleSidebar}>
            <IoClose size={25} />
          </button>
        </div>

        <nav className="mt-10">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={`flex items-center px-4 py-3  hover:bg-white hover:text-black duration-300 transition-colors  ${
                    pathname === item?.href
                      ? "bg-white text-primary"
                      : "text-white"
                  }`}
                >
                  <item.icon className="mr-3" size={20} />
                  <span className="leading-none font-medium">{item.label}</span>
                </a>
              </li>
            ))}
            <li className="flex justify-center mt-5">
              <Button onClick={logout} variant="secondary" className={'w-full mx-4'}>Logout</Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default SideBar;
