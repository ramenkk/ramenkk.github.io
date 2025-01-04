// Mengambil elemen HTML yang diperlukan
const form = document.getElementById('outletForm');
const kodeOutletInput = document.getElementById('kodeOutlet');
const errorMessage = document.getElementById('errorMessage');

// Event listener untuk form submit
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah reload halaman
    const kodeOutlet = kodeOutletInput.value.trim();

    if (!kodeOutlet) {
        showError("Kode Outlet tidak boleh kosong!");
        return;
    }

    // Validasi kode outlet dengan API
    validateKodeOutlet(kodeOutlet)
        .then(outletID => {
            // Setelah validasi berhasil, redirect ke halaman menu
            window.location.href = `../pages/index_pages.html?outlet_id=${outletID}`;
        })
        .catch(error => {
            showError(error);
        });
});

// Fungsi untuk menampilkan pesan error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Fungsi untuk menyembunyikan pesan error
function hideError() {
    errorMessage.style.display = 'none';
}

// Fungsi untuk validasi kode outlet
function validateKodeOutlet(kodeOutlet) {
    return fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/validate?kode_outlet=${kodeOutlet}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Kode outlet tidak valid atau tidak ditemukan.");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                return data.outlet_id; // Kembalikan outlet_id jika valid
            } else {
                throw new Error("Kode outlet tidak valid atau tidak ditemukan.");
            }
        });
}
