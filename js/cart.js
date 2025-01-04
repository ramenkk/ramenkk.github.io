// Simpan item keranjang dalam array
let cartItems = [];

// Fungsi untuk menambahkan item ke keranjang
function addToCart(item) {
    // Cek jika item sudah ada di keranjang
    const itemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (itemIndex > -1) {
        // Update jumlah item
        cartItems[itemIndex].quantity += 1;
        // Update subtotal berdasarkan jumlah baru
        cartItems[itemIndex].subtotal = cartItems[itemIndex].harga * cartItems[itemIndex].quantity;
    } else {
        item.quantity = 1; // Set jumlah awal item ke 1
        item.subtotal = item.harga * item.quantity; // Hitung subtotal untuk item pertama
        cartItems.push(item); // Tambah item ke keranjang
    }

    // Update tampilan keranjang
    updateCartDisplay();
    // Tampilkan keranjang
    toggleCartModal(true);
}



// Fungsi untuk menambah jumlah item di keranjang
function increaseQuantity(itemId) {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += 1;
        item.subtotal = item.harga * item.quantity; // Update subtotal
        updateCartDisplay(); // Update tampilan keranjang setelah perubahan
    }
}

// Fungsi untuk mengurangi jumlah item di keranjang
function decreaseQuantity(itemId) {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.subtotal = item.harga * item.quantity; // Update subtotal
        updateCartDisplay(); // Update tampilan keranjang setelah perubahan
    }
}


// Fungsi untuk menghapus item dari keranjang
function removeItemFromCart(itemId) {
    cartItems = cartItems.filter(cartItem => cartItem.id !== itemId);
    updateCartDisplay(); // Update tampilan keranjang setelah item dihapus
}



// Fungsi untuk menghitung total harga
function calculateTotalPrice() {
    return cartItems.reduce((total, item) => total + item.subtotal, 0); // Jumlahkan subtotal untuk semua item
}


// Fungsi untuk mengupdate tampilan keranjang
// Fungsi untuk mengupdate tampilan keranjang
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    
    cartItemsContainer.innerHTML = ''; // Kosongkan isi keranjang

    // Jika keranjang kosong, tampilkan pesan
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-gray-500">Keranjang Anda kosong.</p>`;
    } else {
        cartItems.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'flex justify-between items-center border-b py-2';
            cartItemDiv.innerHTML = `
                <span>${item.nama_menu} (x${item.quantity})</span>
                <span>Rp ${item.harga.toLocaleString('id-ID')}</span>
                <div class="flex space-x-2">
                    <button onclick="increaseQuantity('${item.id}')" class="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">+</button>
                    <button onclick="decreaseQuantity('${item.id}')" class="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600">-</button>
                    <button onclick="removeItemFromCart('${item.id}')" class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Hapus</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
    }

    // Update total harga
    totalPriceElement.textContent = `Total: Rp ${calculateTotalPrice().toLocaleString('id-ID')}`;
}




// Fungsi untuk toggle tampilan modal keranjang
function toggleCartModal(show) {
    const cartModal = document.getElementById('cartModal');
    if (show) {
        cartModal.classList.remove('hidden');
    } else {
        cartModal.classList.add('hidden');
    }
}

// Fungsi untuk menutup modal keranjang
document.getElementById('closeCart').addEventListener('click', () => {
    toggleCartModal(false);
});



// Fungsi untuk merender menu
function renderMenu(data) {
    const restoContainer = document.getElementById('resto');
    restoContainer.innerHTML = ''; // Clear the container before rendering new menu

    data.forEach(menu => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4'; // Responsive grid columns

        const card = document.createElement('div');
        card.className = 'card shadow-lg rounded-xl overflow-hidden mb-4';

        // Use default values for fields if they're missing
        const deskripsi = menu.deskripsi || "Tidak ada deskripsi tersedia.";
        const gambar = menu.gambar || 'path/to/default/image.jpg';
        const harga = menu.harga ? `Rp ${menu.harga.toLocaleString('id-ID')}` : "Harga tidak tersedia.";

        // Build the card content
        card.innerHTML = `
            <img src="${gambar}" alt="${menu.nama_menu}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${menu.nama_menu}</h3>
                <p class="text-sm text-gray-600 mb-3">${deskripsi}</p>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-blue-500">${harga}</span>
                    <button class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow-md hover:bg-blue-600 transition" 
                        onclick="addToCart({ id: '${menu.id}', nama_menu: '${menu.nama_menu}', harga: ${menu.harga} })">
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


