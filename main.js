

const burger = document.querySelector('.burger');
const navContainer = document.querySelector('.nav-container');

burger.addEventListener('click', () => {
    navContainer.classList.toggle('active'); // Toggle menu saat burger diklik
});





document.addEventListener('DOMContentLoaded', async () => {
    const restoContainer = document.getElementById('resto');

    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/resto');
        const data = await response.json();

        data.forEach(restaurant => {
            const card = document.createElement('div');
            card.className = "bg-white shadow-md rounded-lg overflow-hidden";

            card.innerHTML = `
                <img src="${restaurant.photo || 'path/to/default/image.jpg'}" alt="${restaurant.nama}" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-800">${restaurant.nama}</h3>
                    <p class="text-sm text-gray-600">${restaurant.alamat}</p>
                    <p class="text-sm text-gray-600">${restaurant.kategori}</p>
                </div>
            `;

            restoContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});
    