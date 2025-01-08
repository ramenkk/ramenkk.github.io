// Ambil daftar menu ramen
fetchMenuRamen();

// Fungsi untuk mengambil daftar menu ramen
function fetchMenuRamen() {
    fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen')
        .then(response => {
            if (!response.ok) {
                throw new Error("Gagal mengambil menu.");
            }
            return response.json();
        })
        .then(menuData => {
            if (menuData.status === "success") {
                renderMenu(menuData.data); // Render semua item menu
                addCategoryFilter(menuData.data); // Tambahkan fungsi filter kategori
            } else {
                throw new Error("Menu tidak ditemukan.");
            }
        })
        .catch(error => {
            alert(error.message);
        });
}

// Fungsi untuk merender daftar menu
function renderMenu(data) {
    const restoContainer = document.getElementById('resto');
    restoContainer.innerHTML = ''; // Bersihkan container sebelum render ulang

    data.forEach(menuramen => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4'; // Responsive grid columns

        const card = document.createElement('div');
        card.className = 'card shadow-lg rounded-xl overflow-hidden mb-4';

        // Gunakan nilai default jika field kosong
        const deskripsi = menuramen.deskripsi || "Tidak ada deskripsi tersedia.";
        const gambar = menuramen.gambar || 'path/to/default/image.jpg';
        const harga = menuramen.harga ? `Rp ${menuramen.harga.toLocaleString('id-ID')}` : "Harga tidak tersedia.";
        const available = menuramen.available ? "Tersedia" : "Tidak Tersedia"; // Menambahkan status ketersediaan menu

        // Isi konten card
        card.innerHTML = `
            <img src="${gambar}" alt="${menuramen.nama_menu}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${menuramen.nama_menu}</h3>
                <p class="text-sm text-gray-600 mb-3">${deskripsi}</p>
                <div class="text-sm text-gray-500 mb-3">${available}</div> <!-- Menambahkan status ketersediaan -->
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-blue-500">${harga}</span>
                    <button class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow-md hover:bg-blue-600 transition" 
                        onclick="addToCart({ 
                            id: '${menuramen.id}', 
                            nama_menu: '${menuramen.nama_menu}', 
                            harga_satuan: ${menuramen.harga}, 
                            menu_id: '${menuramen.id}' 
                        })">
                        Pesan
                    </button>
                </div>
            </div>
        `;
        // Tambahkan card ke kolom, lalu tambahkan kolom ke container
        col.appendChild(card);
        restoContainer.appendChild(col);
    });
}


// Fungsi untuk menambahkan item ke keranjang
function addToCart(item) {
    console.log('Item added to cart:', item);
    // Tambahkan logika keranjang di sini
}

// Tambahkan filter kategori
function addCategoryFilter(menuData) {
    const categoryButtons = document.querySelectorAll('[data-category]');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            const filteredData = category === 'all' 
                ? menuData 
                : menuData.filter(item => item.kategori === category);
            renderMenu(filteredData);
        });
    });
}


// Fungsi untuk konfirmasi pesanan
// Fungsi untuk konfirmasi pesanan
document.getElementById('confirmOrder').addEventListener('click', () => {
    const customerName = document.getElementById('customerName').value.trim();
    const orderNote = document.getElementById('orderNote').value.trim();

    if (!customerName) {
        alert('Nama pelanggan harus diisi.');
        return;
    }

    const daftarMenu = cartItems.map(item => ({
        menu_id: item.id,
        nama_menu: item.nama_menu,
        harga_satuan: item.harga,
        jumlah: item.quantity,
        subtotal: item.subtotal
    }));

    const totalHarga = calculateTotalPrice();  // Menghitung total harga seluruh pesanan

    const orderData = {
        nama_pelanggan: customerName,
        catatan_pesanan: orderNote,
        outlet_id: outletID,  // Mengambil outlet_id dari query parameter
        daftar_menu: daftarMenu,
        total_harga: totalHarga
    };

    console.log('Data yang akan dikirim:', orderData);  // Tambahkan log untuk memeriksa data sebelum dikirim

    // Panggil fungsi untuk mengirim data ke server
    postPemesanan(orderData);
});


// Fungsi untuk mengirim data pesanan ke server
async function postPemesanan(data) {
    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/tambah/pesanan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Pesanan berhasil dikirim:', result);

        // Tampilkan pesan sukses
        alert('Pesanan Anda berhasil dikirim!');
        // Reset keranjang dan form setelah sukses
        cartItems = [];
        updateCartDisplay();
    } catch (error) {
        console.error('Error saat mengirim pesanan:', error);
        alert('Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.');
    }
}

