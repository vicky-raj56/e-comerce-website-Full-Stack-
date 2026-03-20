import SideBar from "@/components/SideBar";
import React from "react";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="w-full min-h-[calc(100vh-87px)] bg-gray-50 flex  ">
      <SideBar />
      <div className="flex-1 border">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
