// Profile Page Logic

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) {
        alert('Please log in first.');
        window.location.href = 'index.html';
        return;
    }

    // DOM elements
    const profileForm = document.getElementById('profileForm');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePasswordInput = document.getElementById('profilePassword');

    // Populate the form with current user data
    profileNameInput.value = currentUser.name;
    profileEmailInput.value = currentUser.email;

    // Event Listeners
    profileForm.addEventListener('submit', handleProfileUpdate);

   });

// API Fetch Profile
function fetchUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No user logged in');
        window.location.href = 'index.html';
        return;
    }

    fetch('http://localhost:3000/api/users/profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById('username').value = user.username;
    })
    .catch(error => console.error('Error fetching profile:', error));
}


// API Update Profile
function updateUserProfile(newUsername, newPassword) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No user logged in');
        window.location.href = 'index.html';
        return;
    }

    fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername, password: newPassword })
    })
    .then(response => response.json())
    .then(data => {
        alert('Profile updated!');
    })
    .catch(error => console.error('Error updating profile:', error));
}


