import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

async function fetchMenuData() {
    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/menu_ramen');
        const data = await response.json();

        console.log('Fetched data:', data); 

        const tableBody = document.querySelector('#dataDisplayTable tbody');

        tableBody.innerHTML = '';

        data.forEach(item => {
            console.log('Item id:', item.id); 
    
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

window.onload = fetchMenuData;

async function updateMenu(id, nama_menu, harga, deskripsi, gambar, kategori) {

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
        id: id,        
        nama_menu,
        harga,
        deskripsi,
        gambar,
        kategori,
    };

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/ubah/menu_ramen', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Update failed:', errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'error update menu',
                text: 'Error to update menu ramen.',
                timer: 2000,
                showConfirmButton: false,
              });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Update succesful',
            text: 'Updating menu ramen succesful...',
            timer: 2000,
            showConfirmButton: false,
          });
        closeUpdateModal();
        fetchMenuData(); // Refresh data di tabel
    } catch (error) {
        console.error('Error updating menu:', error);
        Swal.fire({
            icon: 'error',
            title: 'error update menu',
            text: 'Error to update menu ramen.',
            timer: 2000,
            showConfirmButton: false,
          });
    }
});



// delete menu ramen
async function deleteMenu(id) {
    if (!id) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid ID',
            text: 'The menu ID is not valid.',
            timer: 2000,
            showConfirmButton: false,
        });
        return; 
    }

    const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to delete this menu item?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
    });

    if (!confirmed.isConfirmed) {
        return; // User canceled the operation
    }

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/hapus/menu_ramen', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }), 
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Delete failed:', errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error Deleting Menu',
                text: 'Failed to delete the menu item.',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The menu item has been deleted.',
            timer: 2000,
            showConfirmButton: false,
        });
        fetchMenuData(); // Refresh table data
    } catch (error) {
        console.error('Error deleting menu:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while deleting the menu.',
            timer: 2000,
            showConfirmButton: false,
        });
    }
}


document.getElementById('addDataForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    // Ambil data dari form
    const nama_menu = document.getElementById('nama_menu').value;
    const harga = parseFloat(document.getElementById('harga').value);
    const deskripsi = document.getElementById('deskripsi').value;
    const gambar = document.getElementById('gambar').value; // URL gambar
    const kategori = document.getElementById('kategori').value;

    // Siapkan data untuk dikirim
    const postData = {
        nama_menu,
        harga,
        deskripsi,
        gambar, 
        kategori,
    };

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/tambah/menu_ramen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(postData), 
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Error:', errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error posting menu',
                text: 'Error posting menu ramen.',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Success posting menu',
            text: 'Success to post menu ramen.',
            timer: 2000,
            showConfirmButton: false,
        }).then(() => {
            location.reload();  // Refresh the page after success
        });

        document.getElementById('addDataForm').reset();
    } catch (error) {
        console.error('Error submitting data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error submitting post menu',
            text: 'Error submitting menu ramen.',
            timer: 2000,
            showConfirmButton: false,
        });
    }
});


export { updateMenu, deleteMenu, closeUpdateModal };
window.updateMenu = updateMenu;
window.deleteMenu = deleteMenu;
window.closeUpdateModal = closeUpdateModal;


document.addEventListener('DOMContentLoaded', function() {
    function filterMenuData() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const tableRows = document.querySelectorAll('#dataDisplayTable tbody tr');

        tableRows.forEach(row => {
            const namaMenu = row.cells[0].textContent.toLowerCase();
            const harga = row.cells[1].textContent.toLowerCase();
            const deskripsi = row.cells[2].textContent.toLowerCase();
            const kategori = row.cells[4].textContent.toLowerCase();

            if (
                namaMenu.includes(searchInput) || 
                harga.includes(searchInput) || 
                deskripsi.includes(searchInput) || 
                kategori.includes(searchInput)
            ) {
                row.style.display = ''; // Tampilkan baris
            } else {
                row.style.display = 'none'; // Sembunyikan baris
            }
        });
    }

    window.filterMenuData = filterMenuData;
});
