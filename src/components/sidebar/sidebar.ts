import {
  Table,
  FolderArchive,
  CheckCheckIcon,
  LucideMenu,
  SquareMenuIcon,
  MapPin,
  LayoutDashboardIcon,
  PaperclipIcon,
  Map,
  Lock,
} from "lucide-react"

// type MenuItem = {
//   title: string;
//   url: string;
// };

// type SidebarMenuItem = {
//   title: string;
//   url?: string;
//   icon?: LucideIcon;
//   items?: MenuItem[];
// };

export const sidebarMenu = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Update Kelengkapan',
    url: '/updateKelengkapan',
    icon: PaperclipIcon,
  },
  {
    title: 'Peta Hasil Survey',
    url: '/peta',
    icon: Map,
  },
  {
    title: 'Peta Dikunci',
    url: '#',
    icon: Lock,
  },
  {
    title: 'Master Data',
    url: '#',
    icon: Table,
    items: [
      { title: 'Menu', url: '/masterMenu' },
      { title: 'project', url: '/MasterProject' },
      /*  { title: 'Role', url: '/masterRole' }, */
      { title: 'Akun', url: '/masterAkun' },
      /* { title: 'Master Rasio', url: '/MasterRatio' }, */
      { title: 'Detail APK', url: '/DetailApk' },
      { title: 'ULP', url: '/masterULP' },
      { title: 'UP3', url: '/masterUP3' },
      /* { title: 'Master Gardu', url: '/masterGardu' }, */
      { title: 'Tambah Merk KWH', url: '/masterKWH' },
      { title: 'Tambah Merk MCB', url: '/masterMCB' },
      { title: "Geolocation Andro", url: "/geolocationAndro" },
      { title: "Absensi", url: "/Absensi" },
      { title: "Notifikasi", url: "/Notifikasi" },
    ],
  },
  {
    title: 'Rekapitulasi Data',
    url: '#',
    icon: FolderArchive,
    items: [
      { title: 'Pelanggan', url: '/rekapPelanggan' },
      { title: 'Tiang', url: '/rekapTiang' },
      { title: 'Gardu', url: '/masterGardu' },
      { title: 'SR', url: '/rekapSR' },
      { title: 'SUTR', url: '/rekapSUTR' },
      { title: 'Rekap Admin', url: '/rekapAdmin' },
      { title: 'Rasio Pelanggan dan D', url: '/MasterRatio' },
    ],
  },
  {
    title: 'Validasi Data',
    url: '#',
    icon: CheckCheckIcon,
    items: [
      { title: 'Validasi Pelanggan', url: '/validasiPelanggan' },
      { title: 'Validasi BA Gardu', url: '/validasiGardu' },
      { title: 'Approved QC', url: '#' },
    ],
  },
  {
    title: 'Menu Koordinator',
    url: '#',
    icon: LucideMenu,
    items: [
      { title: 'Jadwal', url: '/jadwal' },
      { title: 'Download Foto', url: '/downloadFoto' },
      { title: 'Validasi Gardu', url: '/menuValidasiGardu' },
      { title: 'Data Duplikat', url: '/dataDuplikat' },
    ],
  },
  {
    title: 'Menu Manajemen',
    url: '#',
    icon: SquareMenuIcon,
    items: [
      { title: 'Hasil Survey', url: '#' },
      { title: 'Validasi QC', url: '#' },
    ],
  },
  {
    title: 'Peta',
    url: '#',
    icon: MapPin,
    items: [
      { title: 'Inspeksi Pohon', url: '/peta' },
      /* { title: 'Peta Jaringan', url: '/peta-jaringan' }, */
    ],
  },
]