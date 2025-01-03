document.getElementById('outletForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const kodeOutlet = document.getElementById('kodeOutlet').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (!kodeOutlet) {
        errorMessage.textContent = 'Kode outlet tidak boleh kosong!';
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';

        // Simulasi validasi backend
        fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/outlet?kode_outlet=RAMENBDG01`)
            .then(response => {
                if (response.ok) {
                    // Redirect ke halaman menu
                    window.location.href = `/pages/index.html?kode_outlet=${kodeOutlet}`;
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
