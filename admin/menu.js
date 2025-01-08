// Function to show the modal
function showModal(menuItem) {
    // Populate the form fields with the selected menu item's data
    document.getElementById('namaMenu').value = menuItem.nama_menu;
    document.getElementById('harga').value = menuItem.harga;
    document.getElementById('deskripsi').value = menuItem.deskripsi;
    document.getElementById('gambar').value = menuItem.gambar;
    document.getElementById('kategori').value = menuItem.kategori;
    document.getElementById('available').value = menuItem.available ? 'true' : 'false';
    
    // Store the menu item ID in the form for later use
    document.getElementById('updateMenuForm').setAttribute('data-id', menuItem._id);

    // Show the modal
    document.getElementById('updateMenuModal').style.display = 'flex';
}

// Function to close the modal
document.getElementById('closeModalButton').addEventListener('click', function () {
    document.getElementById('updateMenuModal').style.display = 'none';
});

// Modify the table row creation to include a unique ID for the Edit button
async function fetchMenuData() {
    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen');
        const data = await response.json();

        const tableBody = document.querySelector('#dataDisplayTable tbody');
        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            const editButtonId = `edit-btn-${item._id}`;

            row.innerHTML = `
                <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">${item.nama_menu}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.harga}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.deskripsi}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"><img src="${item.gambar}" alt="Image" class="w-16 h-16 object-cover"></td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.kategori}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.available}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button id="${editButtonId}" class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded">Edit</button>
                    <button class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 ml-2 rounded">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);

            // Add event listener for the Edit button
            document.getElementById(editButtonId).addEventListener('click', function () {
                showModal(item);
            });
        });
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

// Call fetchMenuData when the page loads
window.onload = fetchMenuData;

async function updateMenuItem(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const menuData = {
        ID: formData.get('id'),
        NamaMenu: formData.get('namaMenu'),
        Harga: parseFloat(formData.get('harga')),
        Deskripsi: formData.get('deskripsi'),
        Gambar: formData.get('gambar'),
        Kategori: formData.get('kategori'),
        Available: formData.get('available') === 'true'
    };

    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/ubah/menu_ramen', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Menu updated successfully!');
            fetchMenuData(); // Refresh the table
            document.getElementById('updateMenuModal').style.display = 'none'; // Hide the modal
        } else {
            alert(`Error: ${result.response}`);
        }
    } catch (error) {
        console.error('Error updating menu item:', error);
        alert('An error occurred while updating the menu.');
    }
}

// Attach the form submit handler
document.getElementById('updateMenuForm').addEventListener('submit', updateMenuItem);
