'use client';

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useSelector } from "react-redux";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartPie } from "@/components/chart-pie";
import { Button } from "@/components/ui/button";
import CardTotal from "@/components/ui/card-total";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
/* import Header from "./header"; */
import apiService from "@/services/api-services";
import { RootState } from "@/store";

type UP3 = { id: number; nama_up3: string };
type ULP = { id: number; nama_ulp: string; up3: UP3 };
type User = {
  id: number | string;
  nama: string;
  ulp: ULP | null;
};

export default function Page() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    console.log("DEBUG: Data pengguna saat ini dari Redux store:", currentUser);
  }, [currentUser]);

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiService.get<any[]>('/projects'),
  });

  const { data: gardusData } = useQuery({
    queryKey: ['gardus'],
    queryFn: () => apiService.get<any[]>('/gardus'),
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.get<User[]>('/users'),
  });

  const { data: up3sData } = useQuery({
    queryKey: ['up3s'],
    queryFn: () => apiService.get<UP3[]>('/up3s'),
  });

  const { data: ulpsData } = useQuery({
    queryKey: ['ulps'],
    queryFn: () => apiService.get<ULP[]>('/ulps'),
  });

  const totalProjects = projectsData?.data?.length ?? 0;
  const totalGardus = gardusData?.data?.length ?? 0;
  const totalUsers = usersData?.data?.length ?? 0;
  const totalUp3s = up3sData?.data?.length ?? 0;
  const totalUlps = ulpsData?.data?.length ?? 0;
  const allUsers = usersData?.data ?? [];

  const surveyorColumns: ColumnDef<User>[] = useMemo(() => [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
      size: 50,
    },
    { accessorKey: "nama", header: "Nama Surveyor" },
    {
      accessorKey: "ulp.nama_ulp",
      header: "ULP",
      cell: ({ row }) => row.original.ulp?.nama_ulp || '-'
    },
    {
      accessorKey: "ulp.up3.nama_up3",
      header: "UP3",
      cell: ({ row }) => row.original.ulp?.up3?.nama_up3 || '-'
    },
  ], []);

  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA] min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 border rounded-lg p-4">
              <div className="flex items-center">
                <img src="https://placehold.co/48x48/133863/FFFFFF?text=👋" alt="Welcome Icon" className="w-12 h-12 mr-4 rounded-full" />
                <div>
                  <p className="font-light text-[#383737] text-sm">Selamat Datang,</p>
                  <p className="font-semibold text-lg capitalize">
                    {currentUser ? `${currentUser.nama} (ID: ${currentUser.id})` : 'Pengguna'}!
                  </p>
                </div>
              </div>
              <p className="text-sm mt-5 font-semibold mb-3">Data Survey Seluruh Area</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <CardTotal total={totalProjects.toLocaleString('id-ID')} textColor="text-blue-500" description="Total Project" />
                <CardTotal total={totalGardus.toLocaleString('id-ID')} textColor="text-green-500" description="Total Gardu" />
                <CardTotal total={totalUsers.toLocaleString('id-ID')} textColor="text-yellow-500" description="Total User" />
                <CardTotal total={totalUp3s.toLocaleString('id-ID')} textColor="text-purple-500" description="Total UP3" />
                <CardTotal total={totalUlps.toLocaleString('id-ID')} textColor="text-pink-500" description="Total ULP" />
              </div>
            </div>
            <div className="my-5">
              <ChartPie />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 border rounded-lg p-4">
              <p className="text-sm font-semibold">Data Survey Berdasarkan Area</p>
              <div className="flex mt-3">
                <Input className="rounded-full" placeholder="Cari UP3..." />
                <Button className="ml-2 bg-[#133863] hover:bg-white hover:text-black hover:border text-white rounded-full shrink-0">Ubah Area</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                <CardTotal total={totalProjects.toLocaleString('id-ID')} description="Target Pelanggan" />
                <CardTotal total={"-"} description="Tiang" />
                <CardTotal total={totalGardus.toLocaleString('id-ID')} description="Gardu" />
              </div>
            </div>
            <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4">
              <p className="mb-3 font-semibold text-center">Daftar Surveyor</p>
              <div className="overflow-auto h-80 scrollbar-hide">
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Memuat data surveyor...</p>
                  </div>
                ) : (
                  <DataTable columns={surveyorColumns} data={allUsers} />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
