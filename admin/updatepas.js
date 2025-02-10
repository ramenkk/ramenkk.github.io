document.addEventListener('DOMContentLoaded', function() {
    fetchAdminData();
});

function fetchAdminData() {
    fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/admin')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#adminTable tbody');
            tableBody.innerHTML = ''; // Clear existing data

            data.forEach(admin => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${admin.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${admin.username}</td>
              
                    <td class="px-6 py-4 whitespace-nowrap">${admin.role}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button onclick="updatePassword('${admin.username}')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Update Password
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching admin data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal mengambil data admin. Silakan coba lagi.',
            });
        });
}

function updatePassword(username) {
    Swal.fire({
        title: 'Update Password',
        input: 'text',
        inputLabel: 'Masukkan password baru',
        inputPlaceholder: 'Password baru',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Batal',
        inputValidator: (value) => {
            if (!value) {
                return 'Password tidak boleh kosong!';
            }
            if (value.length < 6 || !/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
                return 'Password harus minimal 6 karakter dan mengandung angka serta huruf!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newPassword = result.value;
            fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/update/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    new_password: newPassword
                })
            })
            .then(response => {
                // Cek apakah respons adalah JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text().then(text => {
                        throw new Error(`Respons bukan JSON: ${text}`);
                    });
                }
            })
            .then(data => {
                if (data.status === "Password updated successfully") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Password berhasil diupdate!',
                    });
                    fetchAdminData(); // Refresh data
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Password berhasil diupdate!',
                    });
                }
            })
            .catch(error => {
                console.error('Succes:', error);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Password berhasil diupdate!',
                });
            });
        }
    });
}



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
      Swal.fire({
        icon: 'success',
        title: 'Update succesful',
        text: 'Updating user succesful...',
        timer: 2000,
        showConfirmButton: false,
      });
      console.log('Success:', result);
      addUserForm.reset(); 
    } else {
      const error = await response.json();
     Swal.fire({
                icon: 'error',
                title: 'error submit data user',
                text: 'Error add new user.',
                timer: 2000,
                showConfirmButton: false,
              });
      console.error('Error:', error);
    }
  } catch (error) {
    // Tangani error saat proses fetch
    Swal.fire({
      icon: 'error',
      title: 'error submit data user',
      text: 'Error add new user.',
      timer: 2000,
      showConfirmButton: false,
    });
    console.error('Fetch Error:', error);
  }
});




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
    fetchActivities();
});

