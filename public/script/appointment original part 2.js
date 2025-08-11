if (!localStorage.getItem('demoToken')) {
  alert("Please login first.");
  window.location.href = "login.html";
}

document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const doctor = document.getElementById('doctor').value;
  const time = document.getElementById('time').value;

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('demoToken')}`
      },
      body: JSON.stringify({
      patientName: localStorage.getItem('demoUser') || 'Guest',
      dentist: doctor,
      date: time,
      reason: ''
})

    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Booking failed');
    alert(`Appointment confirmed with ${doctor} at ${new Date(time).toLocaleString()}`);

    if (confirm("Do you want this info sent to your email?")) {
      alert("Message sent! Have a good day 😊");
    }
  } catch (err) {
    alert(err.message);
  }
});
