// Simple admin credentials
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Check if admin is logged in
if (!localStorage.getItem('adminLoggedIn') && window.location.pathname !== '/admin_login.html') {
    window.location.href = 'admin_login.html';
}
//login

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token && data.user.isAdmin) {
            localStorage.setItem('adminToken', data.token);
            window.location.href = 'admin-dashboard.html';
        } else {
            document.getElementById('loginError').textContent = 'Invalid credentials or not an admin';
        }
    })
    .catch(error => console.error('Error logging in:', error));
});

//logout 
document.getElementById('adminLogoutForm').addEventListener('click', function() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
});