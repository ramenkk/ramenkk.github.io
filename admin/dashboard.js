import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Can't Access Dashboard",
      text: "You need to login before accessing dashboard!",
      timer: 2000,
      customClass: {
        container: 'backdrop-blur-md',
      },
      showConfirmButton: false
    });
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 2000);
    return;
  }

  try {
    const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/admin/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await response.json();

    if (response.status === 200) {
      if (!localStorage.getItem('alertShown')) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          backdrop: false,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Welcome",
          text: data.message + " (Admin ID: " + data.admin_id + ")",
        });
        localStorage.setItem('alertShown', 'true');
      }
    } else {
      throw new Error("Cannot access dashboard!");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Access Restricted",
      text: error.message,
      timer: 2000,
      backdrop: true,
      customClass: {
        container: 'backdrop-blur-md',
      },
      showConfirmButton: false
    });
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 2000);
  }
});
