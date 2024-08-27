document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Signup successful!');
            // Redirect to login or another page
            window.location.href = 'index.html';
        } else {
            alert('Signup failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Signup failed: ' + error.message);
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); // Store JWT token in localStorage
            alert('Login successful!');
            // Redirect to profile or another page
            window.location.href = 'profile.html';
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed: ' + error.message);
    }
}
