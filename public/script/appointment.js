//require login
if (!localStorage.getItem('demoToken')) {
  alert("Please login first.");
  window.location.href = "login.html";
}

const API = {
  list: () => fetch('/api/appointments', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('demoToken')}` }
  }).then(r=>r.json()),
  create: (payload) => fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization': `Bearer ${localStorage.getItem('demoToken')}`
    },
    body: JSON.stringify(payload)
  }).then(async r=>({ ok:r.ok, data:await r.json() })),
  update: (id, payload) => fetch(`/api/appointments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type':'application/json',
      'Authorization': `Bearer ${localStorage.getItem('demoToken')}`
    },
    body: JSON.stringify(payload)
  }).then(async r=>({ ok:r.ok, data:await r.json() })),
  remove: (id) => fetch(`/api/appointments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('demoToken')}` }
  })
};

async function renderList() {
  const ul = document.getElementById('appointmentList');
  if (!ul) return;
  const items = await API.list();
  ul.innerHTML = '';
  (items || []).forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${new Date(a.date).toLocaleString()} – ${a.dentist} (${a.patientName})`;

    //edit (reschedule)
    const edit = document.createElement('button');
    edit.textContent = 'Reschedule';
    edit.onclick = async () => {
      const newTime = prompt('Enter new date/time (YYYY-MM-DDTHH:mm):', a.date?.slice(0,16));
      if (!newTime) return;
      const result = await API.update(a._id, { date: newTime, dentist: a.dentist });
      if (!result.ok) return alert(result.data.message || 'Update failed');
      renderList();
    };

    //delete
    const del = document.createElement('button');
    del.textContent = 'Cancel';
    del.onclick = async () => {
      const ok = confirm('Cancel this appointment?');
      if (!ok) return;
      const r = await API.remove(a._id);
      if (!r.ok) return alert('Delete failed');
      renderList();
    };

    li.appendChild(document.createTextNode(' '));
    li.appendChild(edit);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(del);
    ul.appendChild(li);
  });
}

//create (book)
document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const doctor = document.getElementById('doctor').value;
  const time   = document.getElementById('time').value;

  const payload = {
    patientName: localStorage.getItem('demoUser') || 'Guest',
    dentist: doctor,
    date: time,
    reason: ''
  };

  const { ok, data } = await API.create(payload);
  if (!ok) return alert(data.message || 'Booking failed');
  alert(`Appointment confirmed with ${doctor} at ${new Date(time).toLocaleString()}`);
  renderList();
});

renderList();
