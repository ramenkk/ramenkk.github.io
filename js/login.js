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
