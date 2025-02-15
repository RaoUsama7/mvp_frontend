"use client";
import React, { useEffect } from "react";
import GreetingBanner from "./GreetingBanner";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex flex-col">
      <GreetingBanner />
    </div>
  );
};

export default Dashboard;
