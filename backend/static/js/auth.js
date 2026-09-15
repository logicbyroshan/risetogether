// Password toggle functionality for all password fields
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const eye = document.getElementById(fieldId + '-eye');
    
    if (field.type === 'password') {
        field.type = 'text';
        if (eye) {
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
        }
    } else {
        field.type = 'password';
        if (eye) {
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
        }
    }
}

// Universal handler for form field focus effects
document.querySelectorAll('.form-field').forEach(field => {
    field.addEventListener('focus', function() {
        const label = this.closest('div').querySelector('label');
        if (label) label.style.color = '#f97316';
    });
    
    field.addEventListener('blur', function() {
        const label = this.closest('div').querySelector('label');
        if (label && !this.value) {
            label.style.color = '#e5e7eb';
        }
    });
});

// Specific functions for each page (can be called by their respective forms)

// Forgot Password Page functions
function goBack() {
    // In a real application, you would navigate back to the login page
    console.log('Navigating back to login page.');
    // window.location.href = 'login.html'; 
}

function resendEmail() {
    // In a real application, this would trigger an email resend
    console.log('Resending password reset email.');
}

// Reset Password Page functions
function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };
    
    // Update requirement indicators
    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(`req-${req}`);
        if (element) {
            const icon = element.querySelector('i');
            if (requirements[req]) {
                element.classList.remove('unmet');
                element.classList.add('met');
                if (icon) {
                    icon.classList.remove('fa-circle');
                    icon.classList.add('fa-check-circle');
                }
            } else {
                element.classList.remove('met');
                element.classList.add('unmet');
                if (icon) {
                    icon.classList.remove('fa-check-circle');
                    icon.classList.add('fa-circle');
                }
            }
        }
    });
    
    // Update strength bar
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (strengthBar && strengthText) {
        if (strength === 0) {
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar strength-weak';
            strengthText.textContent = 'Password strength: Weak';
            strengthText.className = 'text-xs mt-1 text-red-400';
        } else if (strength <= 2) {
            strengthBar.style.width = '33%';
            strengthBar.className = 'strength-bar strength-weak';
            strengthText.textContent = 'Password strength: Weak';
            strengthText.className = 'text-xs mt-1 text-red-400';
        } else if (strength === 3) {
            strengthBar.style.width = '66%';
            strengthBar.className = 'strength-bar strength-medium';
            strengthText.textContent = 'Password strength: Medium';
            strengthText.className = 'text-xs mt-1 text-yellow-400';
        } else {
            strengthBar.style.width = '100%';
            strengthBar.className = 'strength-bar strength-strong';
            strengthText.textContent = 'Password strength: Strong';
            strengthText.className = 'text-xs mt-1 text-green-400';
        }
    }
    
    return strength === 4; // Returns true if all requirements are met
}

function validatePasswordMatch() {
    const password = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const matchDiv = document.getElementById('passwordMatch');
    const matchText = document.getElementById('matchText');

    if (password && confirmPassword && matchDiv && matchText) {
        if (confirmPassword.value.length > 0) {
            matchDiv.classList.remove('hidden');
            if (password.value === confirmPassword.value) {
                matchText.textContent = '✓ Passwords match';
                matchText.className = 'text-green-400 font-semibold';
            } else {
                matchText.textContent = '✗ Passwords do not match';
                matchText.className = 'text-red-400 font-semibold';
            }
        } else {
            matchDiv.classList.add('hidden');
        }
    }
}

function goToLogin() {
    // In a real application, you would navigate to the login page
    console.log('Navigating to login page.');
    // window.location.href = 'login.html';
}

// Login/Join Page common functions
function signInWithGoogle() {
    console.log('Google Sign In/Up initiated.');
    // In a real application, this would redirect to Google OAuth
}

// Add event listeners for password fields on reset and join pages
document.addEventListener('DOMContentLoaded', () => {
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const joinPassword = document.getElementById('password'); // For join.html
    const joinConfirmPassword = document.getElementById('confirmPassword'); // For join.html

    if (newPassword && confirmPassword) { // For reset.html
        newPassword.addEventListener('input', () => {
            checkPasswordStrength(newPassword.value);
            validatePasswordMatch();
        });
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }

    // For join.html, ensure it doesn't conflict with reset.html logic if both are present
    if (joinPassword && joinConfirmPassword && !newPassword) { // Only if it's the join page
        joinPassword.addEventListener('input', validatePasswordMatch);
        joinConfirmPassword.addEventListener('input', validatePasswordMatch);
    }
});