"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useArcGis } from "@/components/arcgis/context/ArcGisProvider";
import * as arcgisApiService from "@/components/arcgis/services/arcgisApiService";
import { DataSelector } from "@/components/ui/DataSelector";
import apiService from "@/services/api-services";

type User = {
  id: number;
  nama: string;
  ulp_id: number;
  img?: string;
  img_url?: string;
};

export default function Header() {
  const queryClient = useQueryClient();
  const {
    services,
    isServicesLoading,
    selectedService,
    setSelectedService,
  } = useArcGis();

  const localUser = useMemo(() => {
    const user = localStorage.getItem("user");
    return user ? (JSON.parse(user) as User) : null;
  }, []);

  const { } = useQuery<User>({
    queryKey: ["currentUser", localUser?.id],
    queryFn: async () => {
      if (!localUser) throw new Error("User belum login");
      const res = await apiService.get(`/users/${localUser.id}`);
      return res.data as User;
    },
    enabled: !!localUser?.id,
  });

  const handlePrefetchLayers = (serviceName: string) => {
    queryClient.prefetchQuery({
      queryKey: ['arcgis', 'layers', serviceName],
      queryFn: () => arcgisApiService.fetchLayersForService(serviceName),
    });
  };

  /* const avatarSrc = currentUser?.img_url || (currentUser?.img ? (currentUser.img.startsWith("http") ? currentUser.img : `${import.meta.env.VITE_API_URL}/storage/${currentUser.img}`) : "/avatar.png");
  */
  return (
    <header className="flex mt-3 mx-3 flex-wrap h-auto min-h-16 shrink-0 items-center justify-between px-4 py-2 gap-4 md:gap-2">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <DataSelector
          label=""
          placeholder="Pilih Service"
          loadingPlaceholder="Memuat..."
          value={selectedService}
          onValueChange={setSelectedService}
          options={services}
          valueKey="name"
          labelKey="name"
          isLoading={isServicesLoading}
          onItemHover={handlePrefetchLayers}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* <img src={avatarSrc} alt="avatar" className="w-10 h-10 rounded-full shadow-sm object-cover border-2 border-white" /> */}
        <ProfileDropdown />
      </div>
    </header>
  );
}