  // Function to fetch data and populate the table
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
        
        row.innerHTML = `
          <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">${item.nama_menu}</td>
          <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.harga}</td>
          <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.deskripsi}</td>
          <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"><img src="${item.gambar}" alt="Image" class="w-16 h-16 object-cover"></td>
          <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.kategori}</td>
          <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${item.available}</td>
          <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900">Edit</button>
            <button class="text-red-600 hover:text-red-900 ml-2">Delete</button>
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