import React, { useState, useEffect } from 'react';
import CardTotal from "./ui/card-total";
import { apiService } from "@/services/api-services";

interface User {
  id: number;
  name: string;
  role: string;
}

export default function CardSurvey() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.get<User>('/user');
        if (response.user) {
          setUser(response.user);
        } else {
          throw new Error("Data user tidak ditemukan");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan saat mengambil data user.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Memuat data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  const userName = user?.name || 'Pengguna';
  const userRole = user?.role || 'Superadmin';

  return (
    <div className="bg-slate-50 border rounded-lg p-4 text-left">
      <div className="flex items-center">
        <img src="src\assets\hello.png" alt="" />
        <div className="">
          <p className="font-light text-[#383737] text-sm">Selamat Datang,</p>
          <p className="font-semibold text-lg">{userRole}!</p>
        </div>
      </div>
      <p className="text-sm mt-5 font-semibold mb-3">Data Survey</p>
      <div className="grid grid-cols-2 gap-3">
        <CardTotal
          total="128.000"
          textColor="text-green-500"
          description="Target Pelanggan" />
        <CardTotal
          total="110.000"
          description="Realisasi Pelanggan" />
        <CardTotal
          total="14.120"
          description="Tiang" />
        <CardTotal
          total="570"
          description="Gardu" />
      </div>
    </div>
  );
}