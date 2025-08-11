//Require login
const token = localStorage.getItem('demoToken');
if (!token) {
  alert('Please login first.');
  location.href = 'login.html';
}

function decodeJwt(t) {
  try {
    const base64Url = t.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(json); //{ id, role, iat, exp }
  } catch {
    return {};
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? '—';
}

// Account section
(function renderAccount() {
  const claims = decodeJwt(token); //id/role from token
  const demoUser = localStorage.getItem('demoUser') || ''; //your base stores email on login or username on register
  //We don’t know if demoUser is name or email, so show it in both spots for coverage
  setText('acctName', demoUser || '(unknown)');
  setText('acctEmail', demoUser || '(unknown)');
  setText('acctId', claims.id || '(unknown)');
  setText('acctRole', claims.role || '(unknown)');
})();

//Patient profile
(async function loadPatientProfile() {
  try {
    const res = await fetch('/api/patients/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setText('ppDob', data?.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : '(not set)');
    setText('ppAddress', data?.address || '(not set)');
    setText('ppPhone', data?.phone || '(not set)');
    setText('ppNotes', data?.extraNotes || '(not set)');
  } catch (e) {
    console.warn('Profile load failed:', e);
  }
})();

// Appointments
(async function loadAppointments() {
  try {
    const res = await fetch('/api/appointments', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const items = await res.json();
    const ul = document.getElementById('apptList');
    if (!ul) return;
    ul.innerHTML = '';

    (items || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
      .forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${new Date(a.date).toLocaleString()} — ${a.dentist} (${a.patientName})${a.reason ? ' — ' + a.reason : ''}`;
        ul.appendChild(li);
      });

    if (!items || items.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No appointments yet.';
      ul.appendChild(li);
    }
  } catch (e) {
    console.warn('Appointments load failed:', e);
  }
})();
