function register(event) {
    event.preventDefault(); 

    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    const url = 'http://127.0.0.1:8000/api/register';
    const data = {
        name: name,
        email: email,
        password: password
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Register successfully') {
                console.log('Success:', data);
                localStorage.setItem('access_token', data.access_token);
                alert('Successfully registered!');
            } else {
                console.error('Error:', data);
                alert('Registration failed. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        });
}


function login(event) {
    event.preventDefault(); 
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    const url = 'http://127.0.0.1:8000/api/login'; 
    const data = {
        email: email,
        password: password
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Login successfully') {
                console.log('Success:', data);
                localStorage.setItem('access_token', data.access_token);

                // Check user category and redirect accordingly
                if (data.category === 'admin') {
                    alert('Admin login successful!');
                    window.location.href = 'admin.html'; // Redirect to admin page
                } else {
                    alert('User login successful!');
                    window.location.href = 'index.html'; // Redirect to user page
                }
            } else {
                console.error('Error:', data);
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
}



function logout() {
    fetch('http://127.0.0.1:8000/api/logout', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            localStorage.removeItem('access_token');
            alert('Logout successful!');
            window.location.href = 'login.html';
        } else {
            throw new Error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        alert('Logout failed');
    });
}

