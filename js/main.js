

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
    const categoryNav = document.getElementById('categoryNav');

    let menuData = []; // Menyimpan data menu dari API

    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen/byoutletid?outlet_id=6776b3258a04e2a3fbd9b0e1');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        menuData = await response.json();

        if (!Array.isArray(menuData)) {
            throw new Error('Data yang diterima bukan array');
        }

        // Tampilkan semua menu saat pertama kali dimuat
        renderMenu(menuData);

        // Tambahkan event listener untuk navigasi kategori
        categoryNav.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            if (!category) return;

            if (category === 'all') {
                renderMenu(menuData); // Tampilkan semua menu
            } else {
                const filteredData = menuData.filter(item => item.kategori.toLowerCase() === category);
                renderMenu(filteredData); // Tampilkan menu berdasarkan kategori
            }
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

    // Fungsi untuk merender menu
    function renderMenu(data) {
        restoContainer.innerHTML = ''; // Kosongkan kontainer
    
        data.forEach(menuramen => {
            const card = document.createElement('div');
            card.className = "bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl";
    
            const deskripsi = menuramen.deskripsi || "Tidak ada deskripsi tersedia.";
            const gambar = menuramen.gambar || 'path/to/default/image.jpg';
            const harga = menuramen.harga ? `Rp ${menuramen.harga.toLocaleString('id-ID')}` : "Harga tidak tersedia.";
    
            card.innerHTML = `
                <img src="${gambar}" alt="${menuramen.nama_menu}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${menuramen.nama_menu}</h3>
                    <p class="text-sm text-gray-600 mb-3">${deskripsi}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-bold text-blue-500">${harga}</span>
                       <button class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow-md hover:bg-blue-600 transition" 
                       onclick="addToCart({ id: '${menuramen.id}', nama_menu: '${menuramen.nama_menu}', harga: ${menuramen.harga} })">
                       Pesan
                       </button>
                    </div>
                </div>
            `;
    
            restoContainer.appendChild(card);
        });
    }
});
    


    