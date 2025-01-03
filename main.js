

const burger = document.querySelector('.burger');
const navContainer = document.querySelector('.nav-container');

burger.addEventListener('click', () => {
    navContainer.classList.toggle('active'); // Toggle menu saat burger diklik
});
$(document).ready(function () {
    $('#carouselExampleIndicators').carousel({
        interval: 3000, // Interval auto slide
        pause: false // Menonaktifkan penghentian saat hover
    });
});



document.addEventListener('DOMContentLoaded', async () => {
    const restoContainer = document.getElementById('resto');

    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen/byoutletid?outlet_id=6776b3258a04e2a3fbd9b0e1');
        
        // Cek apakah respons berhasil
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Pastikan data berupa array
        if (!Array.isArray(data)) {
            throw new Error('Data yang diterima bukan array');
        }

        // Iterasi untuk setiap menu ramen
        data.forEach(menuramen => {
            const card = document.createElement('div');
            card.className = "bg-white shadow-md rounded-lg overflow-hidden";

            // Buat fallback jika deskripsi atau gambar kosong
            const deskripsi = menuramen.deskripsi || "Tidak ada deskripsi tersedia.";
            const gambar = menuramen.gambar || 'path/to/default/image.jpg';
            const harga = menuramen.harga ? `Rp ${menuramen.harga.toLocaleString('id-ID')}` : "Harga tidak tersedia.";

            card.innerHTML = `
                <img src="${gambar}" alt="${menuramen.nama_menu}" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-800">${menuramen.nama_menu}</h3>
                    <p class="text-sm text-gray-600">Harga: ${harga}</p>
                    <p class="text-sm text-gray-600">Deskripsi: ${deskripsi}</p>
                </div>
            `;

            restoContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);

        // Tampilkan pesan error di halaman
        restoContainer.innerHTML = `
            <div class="text-red-600 text-center">
                <p>Terjadi kesalahan saat memuat menu: ${error.message}</p>
            </div>
        `;
    }
});

    