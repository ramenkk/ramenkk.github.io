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
            console.log('Item in table:', item); // Log setiap item dalam tabel
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">${item.nama_menu}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.harga}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.deskripsi}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"><img src="${item.gambar}" alt="Image" class="w-16 h-16 object-cover"></td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.kategori}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.available}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button onclick='showUpdateForm(${JSON.stringify(item)})' class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded">Edit</button>
                    <button class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 ml-2 rounded">Delete</button>
                </td>
            `;
            
            // Append the row to the table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}


// Call the function to fetch data when the page loads
window.onload = fetchMenuData;

// Function to show the update form and populate it with the selected menu item data
// Function to show the update form and populate it with the selected menu item data
// Function to show the update form and populate it with the selected menu item data
// Function to show the update form and populate it with the selected menu item data
// Function to show the update form and populate it with the selected menu item data
// Function to show the update form and populate it with the selected menu item data
// Function to show the update form and populate it with the selected menu item data
function showUpdateForm(menuItem) {
    console.log('Edit button clicked, menu item:', menuItem); // Log the selected item

    if (!menuItem.id) {  // Check for the 'id' property instead of '_id'
        console.error('Menu ID is missing');
        alert('Menu ID is missing. Cannot update.');
        return;
    }

    // Show the overlay and the update form container
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('updateFormContainer').classList.remove('hidden');
    document.getElementById('updateFormContainer').style.display = 'block';

    // Populate the form fields with the data from the selected menu item
    document.getElementById('namaMenu').value = menuItem.nama_menu;
    document.getElementById('harga').value = menuItem.harga;
    document.getElementById('deskripsi').value = menuItem.deskripsi;
    document.getElementById('gambar').value = menuItem.gambar;
    document.getElementById('kategori').value = menuItem.kategori;
    document.getElementById('available').value = menuItem.available.toString();  // Convert to string for select input

    // Set up the form submission handler
    document.getElementById('updateForm').onsubmit = function(event) {
        event.preventDefault(); // Prevent the default form submit
        updateMenu(menuItem.id); // Pass the correct menu ID here
    };
}

// Function to send the updated data to the API
async function updateMenu(menuId) {
    // Ensure that menuId is not undefined
    if (!menuId) {
        console.error('Menu ID is missing');
        alert('Invalid Menu ID');
        return;
    }

    const updatedMenu = {
        ID: menuId,  // Send the menu ID
        nama_menu: document.getElementById('namaMenu').value,
        harga: parseFloat(document.getElementById('harga').value),
        deskripsi: document.getElementById('deskripsi').value,
        gambar: document.getElementById('gambar').value,
        kategori: document.getElementById('kategori').value,
        available: document.getElementById('available').value === 'true' // Convert to boolean
    };

    // Log the updated menu data and URL
    console.log('Updated menu data:', updatedMenu);
    const updateUrl = `https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/ubah/menu_ramen/${menuId}`;
    console.log('API Request URL:', updateUrl); // Log the full URL to ensure menuId is correct

    try {
        const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMenu),
        });

        const data = await response.json();
        console.log('API Response:', data); // Log the response for debugging

        if (response.ok) {
            // If the update was successful, hide the form and reload the table
            alert('Menu updated successfully!');
            closeUpdateForm(); // Close the form and overlay
            fetchMenuData(); // Reload the menu data (table)
        } else {
            alert('Error updating menu: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update menu');
    }
}
// Function to close the update form (hides the form and overlay)
function closeUpdateForm() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('updateFormContainer').style.display = 'none';
}


// Function to send the updated data to the API
// Function to send the updated data to the API
async function updateMenu(menuId) {
    if (!menuId) {
        console.error('Menu ID is missing');
        alert('Invalid Menu ID');
        return;
    }

    const updatedMenu = {
        id: menuId,  // Correctly set the menu ID
        nama_menu: document.getElementById('namaMenu').value,
        harga: parseFloat(document.getElementById('harga').value),
        deskripsi: document.getElementById('deskripsi').value,
        gambar: document.getElementById('gambar').value,
        kategori: document.getElementById('kategori').value,
        available: document.getElementById('available').value === 'true' // Convert to boolean
    };

    const updateUrl = `https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/ubah/menu_ramen/${menuId}`;
    console.log('API Request URL:', updateUrl);  // Log the full URL to ensure it's correct

    try {
        const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMenu),
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            alert('Menu updated successfully!');
            closeUpdateForm(); // Close the form
            fetchMenuData(); // Reload the menu table
        } else {
            alert('Error updating menu: ' + data.response); // Display the error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update menu');
    }
}



// Function to fetch the menu data and display it in the table
async function fetchMenuData() {
    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen');
        const data = await response.json();

        console.log('Fetched data:', data); // Log the fetched data

        // Get the table body element
        const tableBody = document.querySelector('#dataDisplayTable tbody');

        // Clear existing rows if any
        tableBody.innerHTML = '';

        // Loop through the data and append rows to the table
        data.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">${item.nama_menu}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.harga}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.deskripsi}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"><img src="${item.gambar}" alt="Image" class="w-16 h-16 object-cover"></td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.kategori}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.available}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button onclick='showUpdateForm(${JSON.stringify(item)})' class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded">Edit</button>
                    <button class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 ml-2 rounded">Delete</button>
                </td>
            `;
            
            // Append the row to the table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

// Fetch the data when the page loads
window.onload = fetchMenuData;
