(function () {
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <a href="home.html">Home</a>
    <span data-nav="guest">
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    </span>
    <span data-nav="auth" style="display:none;">
      <a href="appointment.html">Book Appointment</a>
      <a href="myprofile.html">My Profile</a>
      <a href="#" id="logoutBtn">Sign out</a>
    </span>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  const token = localStorage.getItem('demoToken');
  const g = nav.querySelector('[data-nav="guest"]');
  const a = nav.querySelector('[data-nav="auth"]');
  if (g) g.style.display = token ? 'none':'inline';
  if (a) a.style.display = token ? 'inline':'none';

  const path = location.pathname.split('/').pop();
  nav.querySelectorAll('a').forEach(el=>{
    if (el.getAttribute('href') === path) el.classList.add('active');
  });

  const logout = nav.querySelector('#logoutBtn');
  if (logout) logout.addEventListener('click', (e)=>{
    e.preventDefault();
    localStorage.removeItem('demoToken');
    localStorage.removeItem('demoUser');
    location.href = 'home.html';
  });
})();