"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import apiService from "@/services/api-services";

type UP3 = { id: number; nama_up3: string };
type ULP = { id: number; nama_ulp: string; up3: UP3 };
type User = {
  id: number;
  nama: string;
  username: string;
  email: string;
  status: string;
  ulp_id?: number | null;
  img?: string;
  img_url?: string;
  ulp: ULP | null;
};

type FormData = {
  nama: string;
  img?: FileList | null;
};

export default function DataDiri() {
  const queryClient = useQueryClient();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  const localUser = localStorage.getItem("user");
  const parsedUser: User | null = localUser ? JSON.parse(localUser) : null;

  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["currentUser", parsedUser?.id],
    queryFn: async () => {
      if (!parsedUser) throw new Error("User belum login");
      const res = await apiService.get(`/users/${parsedUser.id}`);
      return res.data as User;
    },
    enabled: !!parsedUser?.id,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (currentUser) {
      setValue("nama", currentUser.nama);

      if (currentUser.img_url) {
        setPhotoPreview(currentUser.img_url);
      } else if (currentUser.img) {
        const imageUrl = currentUser.img.startsWith("http")
          ? currentUser.img
          : `${import.meta.env.VITE_API_URL}/storage/${currentUser.img}`;
        setPhotoPreview(imageUrl);
      } else {
        setPhotoPreview(null);
      }
    }
  }, [currentUser, setValue]);

  const updateUserMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const payload = new FormData();
      payload.append("nama", formData.nama);

      if (formData.img && formData.img.length > 0) {
        payload.append("img", formData.img[0]);
      }

      if (currentUser) {
        payload.append("username", currentUser.username || "");
        payload.append("email", currentUser.email || "");
        payload.append("status", currentUser.status ?? "aktif");

        if (currentUser.ulp_id != null) {
          payload.append("ulp_id", String(currentUser.ulp_id));
        } else if (currentUser.ulp?.id != null) {
          payload.append("ulp_id", String(currentUser.ulp.id));
        }
      }

      payload.append("_method", "PUT");

      return apiService.post(`/users/${currentUser!.id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      const updatedUser = response.data as User;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      queryClient.invalidateQueries({ queryKey: ["currentUser", updatedUser.id] });
      alert("Data diri berhasil diperbarui!");
    },
    onError: (error: any) => {
      alert(`Gagal memperbarui data: ${error.response?.data?.message || error.message}`);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!currentUser) {
      alert("Data pengguna tidak ditemukan, silakan login ulang.");
      return;
    }
    updateUserMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-lg mt-4 mb-10 w-full md:w-[900px] max-w-5xl mx-auto transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 ml-4">Data Diri</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row items-center md:items-start gap-6"
      >
        <div className="w-full md:w-1/3 flex flex-col items-center gap-3">
          <div className="w-60 h-60 bg-gray-100 overflow-hidden shadow-inner rounded-full">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Foto Profil"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Foto
              </div>
            )}
          </div>
          <Input
            type="file"
            accept="image/*"
            {...register("img")}
            onChange={handlePhotoChange}
            className="w-full"
          />
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <Label htmlFor="nama" className="text-sm font-medium text-gray-700">
              Nama Lengkap
            </Label>
            <Input
              id="nama"
              placeholder="Masukkan nama lengkap"
              {...register("nama", { required: true })}
            />
            {errors.nama && (
              <p className="text-red-500 text-xs mt-1">
                Nama lengkap wajib diisi.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="up3" className="text-sm font-medium text-gray-700">
              UP3
            </Label>
            <Input
              id="up3"
              value={currentUser?.ulp?.up3?.nama_up3 || "Tidak tersedia"}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label htmlFor="ulp" className="text-sm font-medium text-gray-700">
              ULP
            </Label>
            <Input
              id="ulp"
              value={currentUser?.ulp?.nama_ulp || "Tidak tersedia"}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <Button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="mt-6 w-full md:w-auto"
          >
            {updateUserMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
