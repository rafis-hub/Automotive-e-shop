document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
<<<<<<< HEAD
        alert(data);
        // Store JWT token or redirect to profile page
        window.location.href="profile.html"
    })
    .catch(error => console.error('Error:', error));
});

=======
        if (data._id) {
            localStorage.setItem('userId', data._id);}
        alert(data);
        //store jwt token
        window.location.href= "profile.html"
    })
    .catch(error => console.error('Error:', error));
});
>>>>>>> 4cc12d54c10422a6dbae30721986530fb7d87e4c
