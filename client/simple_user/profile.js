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

    // Fetch and display user profile data
    fetch('http://localhost:3000/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Profile updated!');
    })
    .catch(error => console.error('Error:', error));

    // Handle profile update
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedData = {
            name: profileName.value,
            email: profileEmail.value,
            password: profilePassword.value
        };

        fetch('http://localhost:3000/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (response.ok) {
                alert('Profile updated successfully');
                profilePassword.value = ''; // Clear password field after successful update
            } else {
                throw new Error('Failed to update profile');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
