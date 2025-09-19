import React, { useState } from 'react';

const getCsrfCookie = async () => {
    try {
        await fetch('/sanctum/csrf-cookie');
        console.log("CSRF cookie berhasil didapatkan.");
    } catch (error) {
        console.error('Gagal mengambil CSRF token:', error);
        throw new Error('Tidak dapat terhubung ke server untuk otentikasi.');
    }
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await getCsrfCookie();

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            // Ambil data JSON dari respons.
            const data = await response.json();

            // 3. Tangani respons dari server.
            if (!response.ok) {
                // Jika login gagal, tampilkan pesan error dari server jika ada.
                const errorMessage = data.message || 'Email atau password yang Anda masukkan salah.';
                throw new Error(errorMessage);
            }

            // 4. Jika login berhasil, arahkan pengguna ke halaman utama.
            console.log('Login berhasil!', data);
            window.location.href = '/master-gardu'; // Ganti dengan rute dashboard Anda.

        } catch (e: any) {
            console.error('Terjadi kesalahan saat proses login:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    Login ke Akun Anda
                </h2>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Alamat Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="anda@contoh.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Menampilkan pesan error jika ada */}
                    {error && (
                        <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
