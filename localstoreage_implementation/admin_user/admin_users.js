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

// Dummy users data
let users = JSON.parse(localStorage.getItem('users')) || [
    {name: 'John Doe', email: 'john@example.com', id: "" },
    {name: 'Jane Smith', email: 'jane@example.com', id: "" }
];

// DOM elements for users management
const usersTableBody = document.querySelector('#usersTable tbody');

// Initialize Users List
displayUsers();

function displayUsers() {
    usersTableBody.innerHTML = '';

    users.forEach(user => {
        const userRow = document.createElement('tr');

        userRow.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.id}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;

        usersTableBody.appendChild(userRow);
    });
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    const newID = prompt('Enter new id:', user.id);
    const newName = prompt('Enter new name:', user.name);
    const newEmail = prompt('Enter new email:', user.email);

    if (newName && newEmail && newID) {
        user.name = newName;
        user.email = newEmail;
        user.id = newID;
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = users.find(u => u.id === userId);
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
}
