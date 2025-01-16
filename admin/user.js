
const addUserForm = document.getElementById('addUserForm');


addUserForm.addEventListener('submit', async (event) => {
  event.preventDefault(); 


  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  const payload = {
    username,
    password,
    role
  };

  try {

    const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload) 
    });

    if (response.ok) {
      const result = await response.json();
      alert('User berhasil ditambahkan!');
      console.log('Success:', result);
      addUserForm.reset(); 
    } else {
      const error = await response.json();
      alert('Gagal menambahkan user: ' + (error.message || 'Terjadi kesalahan'));
      console.error('Error:', error);
    }
  } catch (error) {
    // Tangani error saat proses fetch
    alert('Terjadi kesalahan: ' + error.message);
    console.error('Fetch Error:', error);
  }
});


// get data aktivitas login

document.addEventListener("DOMContentLoaded", () => {
    const activityTable = document.getElementById("activityTable");
  
    // Fungsi untuk mengambil data aktivitas
    async function fetchActivities() {
      try {
        const response = await fetch(
          "https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/activity"
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
  
        const activities = await response.json();
  

        activityTable.innerHTML = "";
 
        activities.forEach((activity) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="border px-4 py-2">${activity.username || "-"}</td>
            <td class="border px-4 py-2">${new Date(activity.timestamp).toLocaleString() || "-"}</td>
            <td class="border px-4 py-2">${activity.activity || "-"}</td>
          `;
          activityTable.appendChild(row);
        });
      } catch (error) {
        console.error("Error fetching activities:", error);
        activityTable.innerHTML = `
          <tr>
            <td colspan="4" class="border px-4 py-2 text-center text-red-500">
              Gagal memuat data aktivitas
            </td>
          </tr>
        `;
      }
    }
  
    // Panggil fungsi fetch saat halaman dimuat
    fetchActivities();
  });
  
