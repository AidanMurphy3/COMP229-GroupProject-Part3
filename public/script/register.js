document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, email, password })
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('demoToken', data.token);
    localStorage.setItem('demoUser', username);
    window.location.href = 'appointment.html';
  } catch (err) {
    alert(err.message);
  }
});
