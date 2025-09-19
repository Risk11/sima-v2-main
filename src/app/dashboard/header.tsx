"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import apiService from "@/services/api-services";

type UP3 = {
  id: number;
  nama_up3: string;
};

type ULP = {
  id: number;
  nama_ulp: string;
  up3: UP3;
  up3_id: number;
};

type User = {
  id: number;
  nama: string;
  ulp_id: number;
  img?: string;
  img_url?: string;
  ulp: ULP;
};

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedUlp, setSelectedUlp] = useState<ULP | null>(null);
  const [search, setSearch] = useState("");

  const localUser = localStorage.getItem("user");
  const parsedUser: User | null = localUser ? JSON.parse(localUser) : null;

  const { data: currentUser } = useQuery<User>({
    queryKey: ["currentUser", parsedUser?.id],
    queryFn: async () => {
      if (!parsedUser) throw new Error("User belum login");
      const res = await apiService.get(`/users/${parsedUser.id}`);
      return res.data as User;
    },
    enabled: !!parsedUser?.id,
    staleTime: 1000 * 60,
  });

  const { data: ulpsData, isLoading: isLoadingUlps } = useQuery({
    queryKey: ["ulps"],
    queryFn: () => apiService.get<ULP[]>("/ulps"),
  });

  const allUlps = ulpsData?.data ?? [];

  useEffect(() => {
    if (currentUser && allUlps.length > 0) {
      const userUlp = allUlps.find((ulp) => ulp.id === currentUser.ulp_id);
      setSelectedUlp(userUlp || allUlps[0]);
    }
  }, [currentUser, allUlps]);

  const filteredUlps = useMemo(() => {
    if (!search) return allUlps;
    return allUlps.filter((item) =>
      `${item.up3?.nama_up3 || ""} ${item.nama_ulp}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, allUlps]);

  const avatarSrc =
    currentUser?.img_url ||
    (currentUser?.img
      ? currentUser.img.startsWith("http")
        ? currentUser.img
        : `${import.meta.env.VITE_API_URL}/storage/${currentUser.img}`
      : "/src/assets/avatar.png");

  return (
    <div>
      <header className="flex mt-3 mx-3 flex-wrap h-auto min-h-16 shrink-0 items-center justify-between px-4 py-2 gap-4 md:gap-2 transition-all ease-linear">
        <div className="flex items-center gap-2 relative">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />

          {selectedUlp && (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-10 h-10 rounded-full shadow-sm object-cover"
              />
              <div className="text-xs items-start">
                <p className="font-semibold text-black">
                  {selectedUlp.up3?.nama_up3}
                </p>
                <p className="text-gray-600">{selectedUlp.nama_ulp}</p>
              </div>
            </div>
          )}

          {openDropdown && (
            <div className="absolute top-16 left-0 z-50 bg-white border shadow-md rounded-md w-64 p-3">
              <input
                type="text"
                placeholder="Cari UP3 atau ULP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-2"
              />
              <ul className="max-h-48 overflow-y-auto text-sm">
                {isLoadingUlps ? (
                  <li className="text-gray-400 italic px-2 py-1">Memuat...</li>
                ) : filteredUlps.length > 0 ? (
                  filteredUlps.map((item) => (
                    <li
                      key={item.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => {
                        setSelectedUlp(item);
                        setOpenDropdown(false);
                        setSearch("");
                      }}
                    >
                      <p className="font-medium">
                        {item.up3?.nama_up3 || "UP3 Tidak Ditemukan"}
                      </p>
                      <p className="text-gray-500 text-xs">{item.nama_ulp}</p>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic px-2 py-1">
                    Tidak ditemukan
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <ProfileDropdown />
      </header>
    </div>
  );
}
