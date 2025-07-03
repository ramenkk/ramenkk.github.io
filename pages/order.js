const apiUrl = 'https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/pesanan';

// Fungsi untuk memuat data ke dalam tabel berdasarkan pencarian
async function loadTableData(searchQuery = '') {
    try {
        const tableBody = document.querySelector('#dataDisplayTable tbody');
        const backButton = document.getElementById('backButton');

        // Jika searchQuery kosong, kosongkan tabel dan sembunyikan tombol Back
        if (!searchQuery.trim()) {
            tableBody.innerHTML = ''; // Kosongkan tabel
            backButton.classList.add('hidden'); // Sembunyikan tombol Back
            return;
        }

        // Fetch data dari API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Ambil respons mentah
        const responseText = await response.text();
        console.log('Response text:', responseText); // Debug respons mentah

        // Validasi dan bersihkan data JSON
        const jsonData = responseText.trim().match(/^\[.*\]$/)
            ? JSON.parse(responseText.trim())
            : JSON.parse(responseText.trim().replace(/^[^{[]+|[^}\]]+$/g, ''));

        // Kosongkan tabel sebelum menambahkan data baru
        tableBody.innerHTML = '';

        // Filter data berdasarkan searchQuery
        const filteredData = jsonData.filter(order => 
            order.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Jika tidak ada data yang cocok, tampilkan pesan
        if (filteredData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="8" class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center">No data found</td>
            `;
            tableBody.appendChild(row);
        } else {
            // Iterasi data dan tambahkan baris ke tabel
            filteredData.forEach(order => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.nama_pelanggan}</td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.nomor_meja}</td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.daftar_menu.map(item => `${item.nama_menu} (x${item.jumlah})`).join(', ')}</td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">Rp ${order.total_harga.toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.status_pesanan}</td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${new Date(order.tanggal_pesanan).toLocaleDateString()}</td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.pembayaran}</td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.catatan_pesanan || '-'}</td>
                `;

                tableBody.appendChild(row);
            });
        }

        // Tampilkan tombol Back setelah melakukan pencarian
        backButton.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching table data:', error);
    }
}

// Event listener untuk search bar
document.getElementById('searchInput').addEventListener('input', (event) => {
    const searchQuery = event.target.value;
    loadTableData(searchQuery);
});

// Event listener untuk tombol Back (Clear Search)
document.getElementById('backButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = ''; // Kosongkan input pencarian
    loadTableData(''); // Kosongkan tabel
});

// Event listener untuk tombol Back to Home
document.getElementById('backToHomeButton').addEventListener('click', () => {
    window.location.href = '../index.html'; // Redirect ke index.html
});

// Kosongkan tabel saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#dataDisplayTable tbody');
    tableBody.innerHTML = ''; // Kosongkan tabel
});