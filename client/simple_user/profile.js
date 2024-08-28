document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePassword = document.getElementById('profilePassword');
    const token = localStorage.setItem('token', res.data.token);

    if (!token) {
        alert('You need to be logged in to view this page.');
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
        profileName.value = data.name;
        profileEmail.value = data.email;
        profileEmail.password = data.password;
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
