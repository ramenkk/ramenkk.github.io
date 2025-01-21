// Contoh URL API, ganti dengan endpoint API Anda
const apiUrl = 'https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/pesanan';

async function calculateProfit() {
    try {
        // Fetch data dari API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Ambil respons mentah
        const responseText = await response.text();

     
        const jsonData = responseText.trim().match(/^\[.*\]$/)
            ? JSON.parse(responseText.trim())
            : JSON.parse(responseText.trim().replace(/^[^{[]+|[^}\]]+$/g, ''));

        // Variabel untuk menyimpan keuntungan harian dan mingguan
        let dailyProfit = 0;
        let weeklyProfit = 0;

        // Tanggal hari ini dan seminggu yang lalu
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);

        // Iterasi data pesanan
        jsonData.forEach(order => {
            const orderDate = new Date(order.tanggal_pesanan);
            const profit = order.total_harga; // Misal, keuntungan langsung dari total_harga

            // Tambahkan ke keuntungan harian
            if (
                orderDate.getFullYear() === today.getFullYear() &&
                orderDate.getMonth() === today.getMonth() &&
                orderDate.getDate() === today.getDate()
            ) {
                dailyProfit += profit;
            }

            // Tambahkan ke keuntungan mingguan
            if (orderDate >= oneWeekAgo && orderDate <= today) {
                weeklyProfit += profit;
            }
        });

        // Tampilkan hasil di halaman
        document.getElementById('dailyProfit').textContent = `Rp ${dailyProfit.toLocaleString()}`;
        document.getElementById('weeklyProfit').textContent = `Rp ${weeklyProfit.toLocaleString()}`;
    } catch (error) {
        console.error('Error calculating profit:', error);
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', calculateProfit);
