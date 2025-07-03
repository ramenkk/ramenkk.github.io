
// Ambil daftar menu ramen dari API
fetchMenuRamen();

// Fungsi untuk mengambil daftar menu ramen
function fetchMenuRamen() {
    fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/menu_ramen')
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal mengambil menu.');
            }
            return response.json();
        })
        .then(menuData => {
            // Pastikan backend mengembalikan data dalam format yang sesuai
            if (Array.isArray(menuData) && menuData.length > 0) {
                renderMenu(menuData); // Render menu items
                addCategoryFilter(menuData); // Tambahkan filter kategori
            } else {
                throw new Error('Menu tidak ditemukan.');
            }
        })
        .catch(error => {
            alert(error.message);
        });
}

// Fungsi untuk merender daftar menu
function renderMenu(data) {
    const restoContainer = document.getElementById('resto');
    restoContainer.innerHTML = '';

    data.forEach(menu => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4';

        const card = document.createElement('div');
        card.className = 'card shadow-lg rounded-xl overflow-hidden mb-4';

        const deskripsi = menu.deskripsi || "Tidak ada deskripsi tersedia.";
        const gambar = menu.gambar || 'path/to/default/image.jpg';
        const harga = menu.harga ? `Rp ${menu.harga.toLocaleString('id-ID')}` : "Harga tidak tersedia.";

        card.innerHTML = `
            <img src="${gambar}" alt="${menu.nama_menu}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${menu.nama_menu}</h3>
                <p class="text-sm text-gray-600 mb-3">${deskripsi}</p>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-blue-500">${harga}</span>
                    <button class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow-md hover:bg-blue-600 transition" 
                        onclick="showMenuDetail(${JSON.stringify(menu).replace(/"/g, '&quot;')})">
                        Pesan
                    </button>
                </div>
            </div>
        `;

        col.appendChild(card);
        restoContainer.appendChild(col);
    });
}
// Fungsi untuk menambahkan item ke keranjang
function addToCart(item) {
    console.log('Item ditambahkan ke keranjang:', item);
    // Tambahkan logika untuk menyimpan item ke keranjang jika diperlukan
}
addToCart();
// Tambahkan event listener untuk tombol filter kategori
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

// Tambahkan event listener untuk tombol "Add More Menu"
document.getElementById('addMoreMenu').addEventListener('click', () => {
    toggleCartModal(false); // Tutup modal keranjang
});

// Fungsi untuk konfirmasi pesanan
document.getElementById('confirmOrder').addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('Keranjang Anda kosong. Silakan pilih menu terlebih dahulu.');
        return;
    }

    const customerName = document.getElementById('customerName').value.trim();
    const orderNote = document.getElementById('orderNote').value.trim();
    let seatNumber = document.getElementById('seatNumber').value.trim();

    if (!customerName) {
        alert('Nama pelanggan harus diisi.');
        return;
    }

    if (seatNumber === '' || isNaN(seatNumber)) {
        alert('Nomor meja harus diisi dengan angka.');
        return;
    }

    seatNumber = parseInt(seatNumber, 10);

    const daftarMenu = cartItems.map(item => ({
        menu_id: item.id,
        nama_menu: item.nama_menu,
        harga_satuan: item.harga,
        jumlah: item.quantity,
        subtotal: item.subtotal
    }));

    const totalHarga = calculateTotalPrice();

    const orderData = {
        nama_pelanggan: customerName,
        catatan_pesanan: orderNote,
        nomor_meja: seatNumber,
        daftar_menu: daftarMenu,
        total_harga: totalHarga
    };

    console.log('Data yang akan dikirim:', orderData);
    postPemesanan(orderData);
});

// Fungsi untuk mengirim data pesanan ke server
async function postPemesanan(data) {
    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/tambah/pesanan', {
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

        Swal.fire({
            icon: 'success',
            title: 'Pesanan berhasil',
            text: 'Pesanan berhasil dikirim...',
            timer: 2000,
            showConfirmButton: false,
        });

        // Reset keranjang dan form setelah sukses
        cartItems = [];
        updateCartDisplay();
        toggleCartModal(false);
    } catch (error) {
        console.error('Error saat mengirim pesanan:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal mengirim pesanan',
            text: 'Terjadi kesalahan saat mengirim pesanan. ' + error,
            timer: 2000,
            showConfirmButton: false,
        });
    }
}

// Fungsi untuk menampilkan detail menu
function showMenuDetail(menu) {
    const menuDetailModal = document.getElementById('menuDetailModal');
    const menuDetailTitle = document.getElementById('menuDetailTitle');
    const menuDetailImage = document.getElementById('menuDetailImage');
    const menuDetailDescription = document.getElementById('menuDetailDescription');
    const menuDetailPrice = document.getElementById('menuDetailPrice');

    // Isi detail menu ke dalam modal
    menuDetailTitle.textContent = menu.nama_menu;
    menuDetailImage.src = menu.gambar || 'path/to/default/image.jpg';
    menuDetailDescription.textContent = menu.deskripsi || 'Tidak ada deskripsi tersedia.';
    menuDetailPrice.textContent = menu.harga ? `Rp ${menu.harga.toLocaleString('id-ID')}` : 'Harga tidak tersedia.';

    // Tampilkan modal
    menuDetailModal.classList.remove('hidden');

    // Tambahkan event listener untuk tombol "Order"
    document.getElementById('orderButton').onclick = () => {
        addToCart(menu); // Tambahkan menu ke keranjang
        menuDetailModal.classList.add('hidden'); // Sembunyikan modal detail
        toggleCartModal(true); // Tampilkan modal keranjang
    };

    // Tambahkan event listener untuk tombol "Tutup"
    document.getElementById('closeMenuDetail').onclick = () => {
        menuDetailModal.classList.add('hidden');
    };
}