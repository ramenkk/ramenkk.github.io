document.getElementById('outletForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const kodeOutlet = document.getElementById('kodeOutlet').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (!kodeOutlet) {
        errorMessage.textContent = 'Kode outlet tidak boleh kosong!';
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';

        fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/outlet`)
            .then(response => response.json())
            .then(data => {
                const outlet = data.find(outlet => outlet.kode_outlet === kodeOutlet);
                if (outlet) {
                    // Simpan ID outlet di URL query untuk digunakan di halaman berikutnya
                    window.location.href = `../pages/index_pages.html?id=${outlet._id}`;
                } else {
                    errorMessage.textContent = 'Kode outlet tidak valid!';
                    errorMessage.style.display = 'block';
                }
            })
            .catch(() => {
                errorMessage.textContent = 'Terjadi kesalahan pada server.';
                errorMessage.style.display = 'block';
            });
    }
});
