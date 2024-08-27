// Mock database in localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

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

// Initialize
if (currentUser) {
    toggleAuth(true);
} else {
    toggleAuth(false);
}

// Functions

function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const id = Math.floor(Math.random() * 10  + 3);
    if (users.some(user => user.email === email)) {
        alert('User already exists');
        return;
    }

    const newUser = { name, email, password, id,  role: 'user' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful!');
    signupForm.reset();
    signupForm.style="display: none;" //ayto einai gia na mhn emfanizetai to signup otan to xrhshmopoeieis.//
    
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        // toggleAuth(true);
        // alert('Login successful!');
    } else {
        alert('Invalid credentials');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    toggleAuth(false);
    alert('Logged out successfully');
}

function toggleAuth(isLoggedIn) {
    if (isLoggedIn) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        profileLink.style.display = 'inline';
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'block';
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        profileLink.style.display = 'none';
    }
}

//allages gia thn vash dedomenwn apla prepei na vlepw kai poy xtypaei ti
// opote na diplotsekarw apo poy pianei kai poy to stelnei, url , selides, ola

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
            window.location.href = 'login.html'; // Redirect to login page
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
    window.location.href = 'login.html'; // Redirect to login page
}


