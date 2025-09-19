"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Password from "./password";
import DataDiri from "./datadiri";
import Header from "../dashboard/header";

const tabs = [
  { key: "biodata", label: "Data Diri" },
  { key: "password", label: "Ubah Password" },
];

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState<"password" | "biodata">("biodata");

  return (
    <SidebarProvider className="bg-[#FCFCFC] min-h-screen">
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-slate-50 to-white">
        <Header />

        <div className="w-full bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-[1200px] mx-auto px-4 py-3 flex gap-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 rounded-md font-medium transition-all ${selectedTab === tab.key
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-slate-100 text-slate-700"
                  }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === "biodata" ? <DataDiri /> : <Password />}
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
