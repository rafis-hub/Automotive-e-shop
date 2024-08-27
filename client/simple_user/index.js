// DOM elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const logoutLink = document.getElementById('logoutLink');
const loginLink = document.getElementById('loginLink');
const profileLink = document.getElementById('profileLink');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);
logoutLink.addEventListener('click', handleLogout);

// // Initialize
// if (currentUser) {
//     toggleAuth(true);
// } else {
//     toggleAuth(false);
// }

// API Signup
function signup(username, password) {
    fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Store JWT token
            alert('Signup successful!');
            window.location.href = 'index.html'; // Redirect to login page
        } else {
            alert('Signup failed: ' + data);
        }
    })
    .catch(error => console.error('Error:', error));
}

// API Login
function login(username, password) {
    fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Store JWT token
            alert('Login successful!');
            window.location.href = 'profile.html'; // Redirect to profile page
        } else {
            alert('Login failed: ' + data);
        }
    })
    .catch(error => console.error('Error:', error));
}

// API Logout
function logout() {
    localStorage.removeItem('token'); // Remove JWT token
    alert('Logout successful!');
    window.location.href = 'index.html'; // Redirect to login page
}


