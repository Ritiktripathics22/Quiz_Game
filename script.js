const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const branch = document.getElementById('branch').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !branch || !password) {
    alert('Please fill in all fields.');
    return;
  }

  // Simulate login success (you can replace this with real backend auth)
  alert(`Welcome ${username} (${branch})! Redirecting to your quiz dashboard...`);

  // Example redirect
  window.location.href = 'quiz.html';
});
