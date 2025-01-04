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
                renderMenu(menuData.data);
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
            <img src="${gambar}" alt="${menuramen.nama_menu}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${menuramen.nama_menu}</h5>
                <p class="card-text">${deskripsi}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-lg font-weight-bold">${harga}</span>
                    <button class="btn btn-primary" onclick="addToCart({ id: '${menuramen.id}', nama_menu: '${menuramen.nama_menu}', harga: ${menuramen.harga} })">
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
