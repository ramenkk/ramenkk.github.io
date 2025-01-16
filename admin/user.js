
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
