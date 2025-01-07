import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.addEventListener('DOMContentLoaded', function () {
  // Login function
  async function login(username, password) {
    try {
      const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username: username, Password: password })
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('token', data.token);
        return data.token; // Return token for further use
      } else {
        throw new Error('Username atau password salah!');
      }
    } catch (error) {
      throw new Error('Terjadi kesalahan pada server, coba lagi nanti.');
    }
  }

  // Validate kode outlet function
  async function validateKodeOutlet(kodeOutlet, token) {
    try {
      const response = await fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/validate?kode_outlet=${kodeOutlet}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Kode outlet tidak valid atau tidak ditemukan.');
      }

      const data = await response.json();

      if (data.status === "success") {
        return data.outlet_id;
      } else {
        throw new Error('Kode outlet tidak valid atau tidak ditemukan.');
      }
    } catch (error) {
      throw error;
    }
  }

  // Main login and validation process
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const kodeOutlet = document.getElementById('kode_outlet').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.style.display = 'none';

    try {
      if (!kodeOutlet) {
        throw new Error('Kode Outlet tidak boleh kosong!');
      }

      // Perform login
      const token = await login(username, password);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Login berhasil, memvalidasi kode outlet...',
        timer: 2000,
        showConfirmButton: false
      });

      // Validate kode outlet
      const outletID = await validateKodeOutlet(kodeOutlet, token);

      Swal.fire({
        icon: 'success',
        title: 'Validation Successful',
        text: 'Kode Outlet valid, mengarahkan ke dashboard...',
        timer: 2000,
        showConfirmButton: false
      });

      // Redirect to dashboard with outlet ID
      setTimeout(() => {
        window.location.href = `../admin/admin.html?kode_outlet=${outletID}`;
      }, 2000);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
    }
  });
});
