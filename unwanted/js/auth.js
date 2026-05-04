// ============================================================
// ALGOLEAP LMS — Auth Engine
// Handles Login and Session Management
// ============================================================

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = event.target.querySelector('button');
    const originalText = btn.innerHTML;

    try {
        btn.innerHTML = 'Signing in...';
        btn.disabled = true;

        const response = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Success! Store token and user info
            localStorage.setItem('lms_token', data.token);
            localStorage.setItem('lms_user', JSON.stringify(data.user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Login failed');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        console.error('Auth error:', err);
        alert('Could not connect to the authentication server.');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Attach to form if it exists
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});
