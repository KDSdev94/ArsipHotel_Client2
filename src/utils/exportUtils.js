/**
 * Utilitas untuk mengekspor data ke format file yang berbeda
 */

/**
 * Mengekspor array of objects ke CSV dan mengunduhnya
 * @param {Array} data - Data yang akan diekspor
 * @param {String} fileName - Nama file output (tanpa ekstensi)
 * @param {Array} columns - Kolom yang akan disertakan [{ key, label }]
 */
export const exportToCSV = (data, fileName = 'ekspor-data', columns = []) => {
    if (!data || data.length === 0) {
        alert("Tidak ada data untuk diekspor");
        return;
    }

    // Jika kolom tidak didefinisikan secara eksplisit, ambil semua kunci dari objek pertama
    const keys = columns.length > 0 ? columns : Object.keys(data[0]).map(k => ({ key: k, label: k }));

    // Buat header
    const header = keys.map(col => `"${col.label}"`).join(',');

    // Buat baris data
    const rows = data.map(item => {
        return keys.map(col => {
            let value = item[col.key] || '';

            // Format jika nilai adalah objek atau array
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }

            // Bersihkan string dari tanda kutip ganda dan ganti dengan kutip tunggal
            const escapedValue = String(value).replace(/"/g, '""');
            return `"${escapedValue}"`;
        }).join(',');
    });

    // Gabungkan header dan baris
    const csvContent = [header, ...rows].join('\n');

    // Buat Blob dan link unduhan
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${timestamp}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
