async function fetchMenuData() {
    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen');
        const data = await response.json();

        console.log('Fetched data:', data); 

        // Get the table body element
        const tableBody = document.querySelector('#dataDisplayTable tbody');

        // Clear existing rows if any
        tableBody.innerHTML = '';

        // Loop through the data and append rows to the table
        data.forEach(item => {
            console.log('Item id:', item.id); // Pastikan id ada di data
            // Pastikan ID ada dan benar
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">${item.nama_menu}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.harga}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.deskripsi}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"><img src="${item.gambar}" alt="Image" class="w-16 h-16 object-cover"></td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.kategori}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded" onclick="updateMenu('${item.id}', '${item.nama_menu}', ${item.harga}, '${item.deskripsi}', '${item.gambar}', '${item.kategori}')">Update</button>
                    <button class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 ml-2 rounded" onclick="deleteMenu('${item.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

// Call the function to fetch data when the page loads
window.onload = fetchMenuData;

async function updateMenu(id, nama_menu, harga, deskripsi, gambar, kategori) {
    // Pastikan ID yang dikirim adalah string yang sesuai dengan MongoDB ObjectID
    document.getElementById('updateId').value = id;
    document.getElementById('updateNamaMenu').value = nama_menu;
    document.getElementById('updateHarga').value = harga;
    document.getElementById('updateDeskripsi').value = deskripsi;
    document.getElementById('updateGambar').value = gambar;
    document.getElementById('updateKategori').value = kategori;

    // Tampilkan modal
    document.getElementById('updateModal').classList.remove('hidden');
}

function closeUpdateModal() {
    document.getElementById('updateModal').classList.add('hidden');
}

document.getElementById('updateForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('updateId').value; // Ambil ID dari form
    const nama_menu = document.getElementById('updateNamaMenu').value;
    const harga = parseFloat(document.getElementById('updateHarga').value);
    const deskripsi = document.getElementById('updateDeskripsi').value;
    const gambar = document.getElementById('updateGambar').value;
    const kategori = document.getElementById('updateKategori').value;

    // Pastikan kita mengirimkan ID yang benar
    const updatedData = {
        id: id,         // Menggunakan id sesuai dengan MongoDB
        nama_menu,
        harga,
        deskripsi,
        gambar,
        kategori,
    };

    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/ubah/menu_ramen', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Update failed:', errorMessage);
            alert('Failed to update menu: ' + errorMessage);
            return;
        }

        alert('Menu updated successfully');
        closeUpdateModal();
        fetchMenuData(); // Refresh data di tabel
    } catch (error) {
        console.error('Error updating menu:', error);
        alert('Error updating menu');
    }
});
