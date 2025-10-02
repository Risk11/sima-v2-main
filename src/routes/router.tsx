import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';

import PetaDashboardPage from '../pages/PetaDashboardPage';
import Page from '@/app/dashboard/page';
import MasterAkun from '@/app/master-data/master-akun';
import MasterGardu from '@/app/master-data/master-gardu';
import MasterKWH from '@/app/master-data/master-kwh';
import MasterMCB from '@/app/master-data/master-mcb';
import { EditMenu } from '@/app/master-data/master-menu/edit-menu';
import MasterMenu from '@/app/master-data/master-menu/master-menu';
import MasterRole from '@/app/master-data/master-role';
import MasterProject from '@/app/master-data/master-project';
import Absensi from '@/app/master-data/absensi';
import DetailApk from '@/app/master-data/detail-apk';
import Notifikasi from '@/app/master-data/notifikasi';
import MasterULP from '@/app/master-data/master-ulp';
import MasterUP3 from '@/app/master-data/master-up3';
import GeolocationAndroPage from '@/app/master-data/GeolocationAndro';
import MasterRatio from '@/app/master-data/master-ratio';
import DownloadFoto from '@/app/menu-koordinator/download-foto';
import Jadwal from '@/app/menu-koordinator/jadwal';
import MenuValidasiGardu from '@/app/menu-koordinator/validas-gardu';
import Pelanggan from '@/app/rekapitulasi/rekap-pelanggan/pelanggan';
import RekapAdmin from '@/app/rekapitulasi/rekap-admin';
import RekapGardu from '@/app/rekapitulasi/rekap-gardu';
import RekapTiang from '@/app/rekapitulasi/rekap-tiang';
import RekapSR from '@/app/rekapitulasi/sr';
import RekapSUTR from '@/app/rekapitulasi/sutr';
import UpdateKelengkapan from '@/app/update-kelengkapan/update-kelengkapan';
import ValidasiGardu from '@/app/validasi/validasi-gardu';
import DetailPelanggan from '@/app/rekapitulasi/rekap-pelanggan/detail-pelanggan';
import Profile from '@/app/Profile/profile';
import Login from '@/components/login-form';
import DataDuplikat from '@/app/menu-koordinator/data-duplikat';
import ValidasiPelangganV2Page from '@/app/validasi/page';
import DataDuplicatePage from '@/app/data-duplikat/page';

import ArcgisExplorerPage from '../pages/ArcgisExplorerPage';

const Router = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path='/' element={<Page />} />

        <Route path='/arcgis-explorer' element={<ArcgisExplorerPage />} />

        <Route path='/peta' element={<PetaDashboardPage />} />
        <Route path='/updateKelengkapan' element={<UpdateKelengkapan />} />
        <Route path='/menuValidasiGardu' element={<MenuValidasiGardu />} />
        <Route path='/downloadFoto' element={<DownloadFoto />} />
        <Route path='/jadwal' element={<Jadwal />} />
        <Route path='/validasi' element={<ValidasiPelangganV2Page />} />
        <Route path='/validasiGardu' element={<ValidasiGardu />} />
        <Route path='/rekapAdmin' element={<RekapAdmin />} />
        <Route path='/rekapSUTR' element={<RekapSUTR />} />
        <Route path='/rekapSR' element={<RekapSR />} />
        <Route path='/rekapRasio' element={<MasterRatio />} />
        <Route path='/rekapGardu' element={<RekapGardu />} />
        <Route path='/rekapTiang' element={<RekapTiang />} />
        <Route path='/detailPelanggan' element={<DetailPelanggan />} />
        <Route path='/rekapPelanggan' element={<Pelanggan />} />
        <Route path='/masterAkun' element={<MasterAkun />} />
        <Route path='/masterMCB' element={<MasterMCB />} />
        <Route path='/masterKWH' element={<MasterKWH />} />
        <Route path='/masterGardu' element={<MasterGardu />} />
        <Route path='/masterUP3' element={<MasterUP3 />} />
        <Route path='/Absensi' element={<Absensi />} />
        <Route path='/DetailApk' element={<DetailApk />} />
        <Route path='/Notifikasi' element={<Notifikasi />} />
        <Route path='/masterULP' element={<MasterULP />} />
        <Route path='/MasterRatio' element={<MasterRatio />} />
        <Route path='/masterRole' element={<MasterRole />} />
        <Route path='/MasterProject' element={<MasterProject />} />
        <Route path='/detail/:id' element={<EditMenu />} />
        <Route path='/masterMenu' element={<MasterMenu />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/dataDuplikat' element={<DataDuplikat />} />
        <Route path='/geolocationAndro' element={<GeolocationAndroPage />} />
        <Route path='/data-duplikat' element={<DataDuplicatePage />} />
      </Route>
    </Routes>
  )
}

export default Router;