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

    function handleProfileUpdate(event) {
        event.preventDefault();

        const updatedName = profileNameInput.value;
        const updatedPassword = profilePasswordInput.value;

        // Update currentUser and users array
        currentUser.name = updatedName;
        currentUser.password = updatedPassword;

        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
        }

        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('users', JSON.stringify(users));

        alert('Profile updated successfully!');
    }
});

//oi allages gia th vash

//fetch user profile den eixame tha to testarw

// API Fetch Profile
function fetchUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No user logged in');
        window.location.href = 'login.html';
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

// update profile

// API Update Profile
function updateUserProfile(newUsername, newPassword) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No user logged in');
        window.location.href = 'login.html';
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


