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

        // Validasi dan parsing JSON
        const jsonData = responseText.trim().match(/^\[.*\]$/)
            ? JSON.parse(responseText.trim())
            : JSON.parse(responseText.trim().replace(/^[^{[]+|[^}\]]+$/g, ''));

        // Variabel untuk menyimpan keuntungan harian, mingguan, dan bulanan
        let dailyProfit = 0;
        let weeklyProfit = 0;
        let monthlyProfit = 0;

        // Tanggal hari ini, seminggu yang lalu, dan satu bulan yang lalu
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const oneWeekAgo = new Date(today);
        const oneMonthAgo = new Date(today);

        oneWeekAgo.setDate(today.getDate() - 7);
        oneMonthAgo.setMonth(today.getMonth() - 1);

        // Iterasi data pesanan
        jsonData.forEach(order => {
            // Parsing tanggal pesanan
            const orderDate = new Date(order.tanggal_pesanan);
            const profit = order.total_harga; // Misal, keuntungan langsung dari total_harga

            if (
                order.status_pesanan === 'selesai' &&
                orderDate >= startOfToday && 
                orderDate < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000) // Hari ini
            ) {
                dailyProfit += profit;
            }

            // Tambahkan ke keuntungan mingguan jika status selesai
            if (order.status_pesanan === 'selesai' && orderDate >= oneWeekAgo && orderDate <= today) {
                weeklyProfit += profit;
            }

            // Tambahkan ke keuntungan bulanan jika status selesai
            if (order.status_pesanan === 'selesai' && orderDate >= oneMonthAgo && orderDate <= today) {
                monthlyProfit += profit;
            }
        });

        // Tampilkan hasil di halaman
        document.getElementById('dailyProfit').textContent = `Rp ${dailyProfit.toLocaleString('id-ID')}`;
        document.getElementById('weeklyProfit').textContent = `Rp ${weeklyProfit.toLocaleString('id-ID')}`;
        document.getElementById('monthlyProfit').textContent = `Rp ${monthlyProfit.toLocaleString('id-ID')}`;
    } catch (error) {
        console.error('Error calculating profit:', error);
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', calculateProfit);
