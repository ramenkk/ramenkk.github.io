// Ambil outlet_id dari URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const outletID = urlParams.get('outlet_id');

if (!outletID) {
    alert("Outlet ID tidak ditemukan!");
    window.location.href = 'index.html'; // Kembali ke halaman input kode outlet
} else {
    // Ambil daftar menu ramen berdasarkan outlet_id
    fetchMenuRamen(outletID);
}

// Fungsi untuk mengambil daftar menu ramen
function fetchMenuRamen(outletID) {
    fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen/byoutletid?outlet_id=${outletID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Gagal mengambil menu.");
            }
            return response.json();
        })
        .then(menuData => {
            if (menuData.status === "success") {
                renderMenu(menuData.data); // Render all menu items by default
                addCategoryFilter(menuData.data); // Add category filtering functionality
            } else {
                throw new Error("Menu tidak ditemukan untuk outlet ini.");
            }
        })
        .catch(error => {
            alert(error.message);
        });
}

// Fungsi untuk merender daftar menu
function renderMenu(data) {
    const restoContainer = document.getElementById('resto');
    restoContainer.innerHTML = ''; // Clear the container before rendering new menu

    data.forEach(menuramen => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4'; // Responsive grid columns

        const card = document.createElement('div');
        card.className = 'card shadow-lg rounded-xl overflow-hidden mb-4';

        // Use default values for fields if they're missing
        const deskripsi = menuramen.deskripsi || "Tidak ada deskripsi tersedia.";
        const gambar = menuramen.gambar || 'path/to/default/image.jpg';
        const harga = menuramen.harga ? `Rp ${menuramen.harga.toLocaleString('id-ID')}` : "Harga tidak tersedia.";

        // Build the card content
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

        // Append the card to the column, then append the column to the container
        col.appendChild(card);
        restoContainer.appendChild(col);
    });
}

// Function to handle adding items to the cart (Optional, add your logic)
function addToCart(item) {
    console.log('Item added to cart:', item);
}

// Add event listeners for category filter buttons
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
document.getElementById('confirmOrder').addEventListener('click', () => {
    const customerName = document.getElementById('customerName').value.trim();
    const orderNote = document.getElementById('orderNote').value.trim();

    if (!customerName) {
        alert('Nama pelanggan harus diisi.');
        return;
    }

    const orderData = {
        nama_pelanggan: customerName,
        catatan_pesanan: orderNote,
        outlet_id: item.id, 
        daftar_menu: cartItems.map(item => ({
            id_menu: item.id,
            nama_menu: item.nama_menu,
            harga_satuan: item.harga_satuan,
            jumlah: item.jumlah,
        })),
    };

    // Panggil fungsi untuk mengirim data ke server
    postPemesanan(orderData);
});


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
        cart = [];
        updateCartDisplay();
    } catch (error) {
        console.error('Error saat mengirim pesanan:', error);
        alert('Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.');
    }
}