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
