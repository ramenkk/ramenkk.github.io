// Modify the table row creation to include a unique ID for the Edit button
async function fetchMenuData() {
    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen');
        const data = await response.json();

        // Get the table body element
        const tableBody = document.querySelector('#dataDisplayTable tbody');

        // Clear existing rows if any
        tableBody.innerHTML = '';

        // Loop through the data and append rows to the table
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Add a unique ID to the Edit button
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
            
            // Append the row to the table body
            tableBody.appendChild(row);

            // Add an event listener to the Edit button
            document.getElementById(editButtonId).addEventListener('click', function () {
                populateUpdateForm(item);
            });
        });
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

// Call the function to fetch data when the page loads
window.onload = fetchMenuData;

function populateUpdateForm(menuItem) {
    // Populate the form fields with the selected menu item's data
    document.getElementById('namaMenu').value = menuItem.nama_menu;
    document.getElementById('harga').value = menuItem.harga;
    document.getElementById('deskripsi').value = menuItem.deskripsi;
    document.getElementById('gambar').value = menuItem.gambar;
    document.getElementById('kategori').value = menuItem.kategori;
    document.getElementById('available').value = menuItem.available ? 'true' : 'false';
    
    // Store the menu item ID in the form for later use (e.g., for PUT request)
    document.getElementById('updateMenuForm').setAttribute('data-id', menuItem._id);
}


async function updateMenuItem(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form
    const formData = new FormData(event.target);
    const menuData = {
        ID: formData.get('id'),
        NamaMenu: formData.get('namaMenu'),
        Harga: parseFloat(formData.get('harga')),
        Deskripsi: formData.get('deskripsi'),
        Gambar: formData.get('gambar'),
        Kategori: formData.get('kategori'),
        Available: formData.get('available') === 'true' // Convert to boolean
    };

    try {
        // Send PUT request to the API
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
            // Optionally refresh the table after updating
            fetchMenuData();
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
