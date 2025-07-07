import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";


// user.js


// Menambahkan CSS SweetAlert
addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

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

    const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/admin/registers', {
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


// get data aktivitas login

document.addEventListener("DOMContentLoaded", () => {
    const activityTable = document.getElementById("activityTable");
  
    // Fungsi untuk mengambil data aktivitas
    async function fetchActivities() {
      try {
        const response = await fetch(
          "https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/activitys"
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
});