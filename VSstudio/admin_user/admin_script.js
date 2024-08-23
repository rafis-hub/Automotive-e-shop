// Simple admin credentials
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Check if admin is logged in
if (!localStorage.getItem('adminLoggedIn') && window.location.pathname !== '/admin_login.html') {
    window.location.href = 'admin_login.html';
}

// Admin login logic
const adminLoginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');

if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === adminCredentials.username && password === adminCredentials.password) {
            localStorage.setItem('adminLoggedIn', true);
            window.location.href = 'admin_index.html';
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    });
}

// Admin logout logic
const adminLogoutLink = document.getElementById('adminLogoutLink');
if (adminLogoutLink) {
    adminLogoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin_login.html';
    });
}
