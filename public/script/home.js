window.onload = function () {
  const token = localStorage.getItem('demoToken');
  if (token) {
    window.location.href = 'appointment.html';
  }
};

// script/register.js
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  localStorage.setItem('demoToken', '123');
  localStorage.setItem('demoUser', username);
  alert("Registered successfully!");
  window.location.href = "appointment.html";
});
