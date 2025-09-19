export interface GarduPayload {
    nama_gardu: string;
    ulp_id: number;
    ratio_id: number;
}

const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
    const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const csrfToken = getCookie('XSRF-TOKEN');
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
            ...options.headers,
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Terjadi kesalahan pada server.' }));
        throw new Error(errorData.message || 'Gagal melakukan operasi.');
    }

    return response.json();
};

const API_URL = '/api/gardus';

export const getAllGardus = async () => {
    const result = await authenticatedFetch(API_URL);
    return result.data.data.map((gardu: any) => ({
        id: gardu.id,
        nama: gardu.nama_gardu || 'N/A',
        ulp: gardu.ulp?.nama || 'N/A',
        up3: gardu.ulp?.up3?.nama || 'N/A',
        penyulang: gardu.penyulang?.nama || 'N/A',
    }));
};

export const createGardu = async (garduData: GarduPayload): Promise<any> => {
    return authenticatedFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(garduData),
    });
};

export const updateGardu = async (id: number, garduData: GarduPayload): Promise<any> => {
    return authenticatedFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(garduData),
    });
};

export const deleteGardu = async (id: number): Promise<any> => {
    return authenticatedFetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
};