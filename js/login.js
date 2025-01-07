import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.addEventListener('DOMContentLoaded', function () {
  async function login(username, password, kodeOutlet) {
    try {
      // Step 1: Validate username and password
      const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username: username, Password: password })
      });

      const data = await response.json();

      if (response.status !== 200) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Username atau password salah!',
        });
        return;
      }

      // Step 2: Validate kode outlet
      const validateResponse = await fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/validate?kode_outlet=${kodeOutlet}`);
      if (!validateResponse.ok) {
        throw new Error("Kode outlet tidak valid atau tidak ditemukan.");
      }

      const outletData = await validateResponse.json();
      if (outletData.status !== "success") {
        throw new Error("Kode outlet tidak valid atau tidak ditemukan.");
      }

      // Step 3: Store token and redirect
      localStorage.setItem('token', data.token);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Login berhasil, menuju dashboard.',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.href = `../admin/admin.html?outlet_id=${outletData.outlet_id}`;
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  }

  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    const kodeOutlet = document.getElementById('kode_outlet').value.trim();

    if (!kodeOutlet) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Kode outlet tidak boleh kosong!',
      });
      return;
    }

    login(username, password, kodeOutlet);
  });
});

document.getElementById('btnLaporan').addEventListener('click', () => {
  const outlet_id = localStorage.getItem('outlet_id');
  window.location.href = `laporan.html?outlet_id=${outlet_id}`;
});

document.getElementById('btnManajemen').addEventListener('click', () => {
  const outlet_id = localStorage.getItem('outlet_id');
  window.location.href = `manajemen.html?outlet_id=${outlet_id}`;
});

document.addEventListener('DOMContentLoaded', () => {
  const outlet_id = localStorage.getItem('outlet_id'); // Ambil outlet_id dari localStorage

  if (outlet_id) {
    // Tambahkan outlet_id ke URL tujuan
    document.getElementById('btnManajemen').href = `manajemen.html?outlet_id=${outlet_id}`;
    document.getElementById('btnLaporan').href = `laporan.html?outlet_id=${outlet_id}`;
  }
});
