'use client';

import { motion } from 'framer-motion';
import { type FC, type ReactNode, useState, useEffect } from 'react';

import CardArcgis from '@/components/card-arcgis';
import CardPelanggan from '@/components/card-pelanggan';
import CardRekam from '@/components/card-rekam';
import CardSurvey from '@/components/card-survey';
import { ChartPie } from '@/components/chart-pie';
import { DataTable } from '@/components/ui/data-table';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { apiService } from '@/services/api-services';

interface Ulp {
  id: number;
  nama_ulp: string;
}

interface Rekam {
  id: number;
  user?: { name: string };
  created_at: string;
  total_pelanggan: number;
  gardu?: { nama_gardu: string };
}

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  delay?: number;
  isLoading?: boolean;
  error?: string | null;
}

const DashboardCard: FC<DashboardCardProps> = ({ title, children, delay = 0.3, isLoading, error }) => (
  <motion.div
    className="bg-white border border-[#E5E5E5] shadow rounded-2xl p-4 flex flex-col"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
  >
    <h3 className="mb-3 font-semibold text-center text-lg">{title}</h3>
    <div className="overflow-auto h-80 scrollbar-hide">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        children
      )}
    </div>
  </motion.div>
);

const DashboardGrid = () => {
  const [ulpData, setUlpData] = useState<Ulp[]>([]);
  const [rekamData, setRekamData] = useState<Rekam[]>([]);
  const [loading, setLoading] = useState({ ulp: true, rekam: true });
  const [error, setError] = useState<{ ulp: string | null; rekam: string | null }>({ ulp: null, rekam: null });

  const ulpColumns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nama_ulp', header: 'Nama ULP' },
  ];

  useEffect(() => {
    apiService.get<Ulp[]>('/ulps')
      .then((response) => {
        const data = response.data || response;
        if (Array.isArray(data)) {
          setUlpData(data);
        } else {
          setUlpData([]);
        }
      })
      .catch(() => setError((prev) => ({ ...prev, ulp: 'Gagal memuat data ULP.' })))
      .finally(() => setLoading((prev) => ({ ...prev, ulp: false })));

    apiService.get<{ absensis: Rekam[] }>('/absensis')
      .then((response) => {
        if (response.data?.absensis && Array.isArray(response.data.absensis)) {
          setRekamData(response.data.absensis);
        } else {
          setRekamData([]);
        }
      })
      .catch(() => setError((prev) => ({ ...prev, rekam: 'Gagal memuat data rekam.' })))
      .finally(() => setLoading((prev) => ({ ...prev, rekam: false })));
  }, []);

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <CardSurvey />
        <ChartPie />
      </motion.div>

      <motion.div
        className="lg:col-span-2 space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="space-y-4">
          <CardPelanggan />
          <CardArcgis />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard title="Data ULP" delay={0.3} isLoading={loading.ulp} error={error.ulp}>
            {ulpData.length > 0 ? (
              <DataTable columns={ulpColumns} data={ulpData} />
            ) : (
              !loading.ulp && <p className="text-center text-gray-400 p-4">Tidak ada data ULP.</p>
            )}
          </DashboardCard>

          <DashboardCard title="Rekam Sinkron Pelanggan" delay={0.4} isLoading={loading.rekam} error={error.rekam}>
            {rekamData.length > 0 ? (
              <div className="space-y-2">
                {rekamData.map((data) => (
                  <CardRekam
                    key={data.id}
                    nama={data.user?.name || 'Tanpa Nama'}
                    tanggal={new Date(data.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    pelanggan={String(data.total_pelanggan || 0)}
                    gardu={data.gardu?.nama_gardu || 'N/A'}
                  />
                ))}
              </div>
            ) : (
              !loading.rekam && <p className="text-center text-gray-400 p-4">Tidak ada data rekam.</p>
            )}
          </DashboardCard>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Page() {
  return (
    <div className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
      <SidebarProvider className="font-poppins">
        <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA] min-h-screen w-full px-6">
          <DashboardGrid />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
