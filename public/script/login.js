// Replace the mock logic with real fetch
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('demoToken', data.token);  // backend returns token
    localStorage.setItem('demoUser', email);
    window.location.href = 'appointment.html';
  } catch (err) {
    document.getElementById('errorMsg').innerText = err.message;
  }
});
