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
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Login Succes direct to dashboard.',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.href = '../admin/admin.html';
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Username atau password salah!',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Login Failed',
        text: 'Terjadi kesalahan pada server, coba lagi nanti.'
      });
    }
  }

  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    login(username, password);
  });
});



const form = document.querySelector('form'); // Select the form element
const kodeOutletInput = document.getElementById('kode_outlet'); // Corrected to match the HTML id
const errorMessage = document.getElementById('errorMessage'); // Corrected the element for error message

// Event listener for form submit
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload
  const kodeOutlet = kodeOutletInput.value.trim();

  if (!kodeOutlet) {
    showError("Kode Outlet tidak boleh kosong!");
    return;
  }

  // Validate kode outlet with the API
  validateKodeOutlet(kodeOutlet)
    .then(outletID => {
      // After successful validation, redirect to the menu page
      window.location.href = `../admin/index.html?outlet_id=${outletID}`;

    })
    .catch(error => {
      showError(error.message);
    });
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block'; // Show the error message
}

function hideError() {
  errorMessage.style.display = 'none'; // Hide the error message
}

function validateKodeOutlet(kodeOutlet) {
  return fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/validate?kode_outlet=${kodeOutlet}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Kode outlet tidak valid atau tidak ditemukan.");
      }
      return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        return data.outlet_id; 
      } else {
        throw new Error("Kode outlet tidak valid atau tidak ditemukan.");
      }
    });
}