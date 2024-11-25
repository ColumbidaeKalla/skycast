// Track login state (initially false)
let isLoggedIn = false;

// DOM elements for auth buttons
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Add event listener for login, signup, and other button clicks
document.addEventListener('click', function(event) {
    // If not logged in, show a popup when clicking on anywhere except login or signup buttons
    if (!isLoggedIn) {
        if (event.target.id !== 'loginBtn' && event.target.id !== 'signupBtn') {
            showPopup("You need to be logged in to view this content.");
        } else if (event.target.id === 'loginBtn') {
            window.location.href = 'assets/uservalidation/login.php'; // Redirect to login page
        } else if (event.target.id === 'signupBtn') {
            window.location.href = 'assets/uservalidation/signup.php'; // Redirect to signup page
        }
    } else {
        // If the user is logged in and clicks on blurred area, you can handle it here (optional)
        if (event.target.matches('.blurred-area')) {
            showPopup("You are already logged in. Enjoy!");
        }
    }
});

// Function to check if the user is logged in
function checkSession() {
    fetch('assets/uservalidation/check-session.php') // Path to check session file
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // User is logged in, set isLoggedIn flag to true
                isLoggedIn = true;
                updateAuthButtons(); // Update button visibility
                removeBlur(); // Remove blur effects from specific elements
            } else {
                // User is not logged in, apply the blur
                applyBlur();
                isLoggedIn = false;
                updateAuthButtons(); // Update button visibility
            }
        })
        .catch(error => console.error('Error checking session:', error));
}

// Function to toggle visibility of auth buttons
function updateAuthButtons() {
    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Show popup alert with stacking effect
function showPopup(message) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'popup-container';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'popup-close';
    closeBtn.innerHTML = '&times;';

    closeBtn.onclick = function() {
        overlay.remove();
    };

    const content = document.createElement('div');
    content.className = 'popup-content';
    content.innerHTML = `
        <p>To view full details, please log in or sign up</p>
        <div>
            <span>Already have an account? <a href="assets/uservalidation/login.php">Login</a></span><br>
            <span>Create a new account? <a href="assets/uservalidation/signup.php">Signup</a></span>
        </div>
    `;

    popup.appendChild(closeBtn);
    popup.appendChild(content);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Apply blur effect to necessary elements except for specific headers
function applyBlur() {
    const dayForecastElement = document.querySelector('.day-forecast');
    const hourlyForecast = document.querySelector('.hourly-forecast');
    const weatherRightContent = document.querySelectorAll('.weather-right > *:not(h2)');

    if (dayForecastElement) {
        dayForecastElement.style.filter = 'blur(8px)';
        dayForecastElement.style.pointerEvents = 'none';
        dayForecastElement.classList.add('blurred-area');
    }

    if (hourlyForecast) {
        hourlyForecast.style.filter = 'blur(8px)';
        hourlyForecast.style.pointerEvents = 'none';
        hourlyForecast.classList.add('blurred-area');
    }

    if (weatherRightContent) {
        weatherRightContent.forEach(content => {
            content.style.filter = 'blur(8px)';
            content.style.pointerEvents = 'none';
            content.classList.add('blurred-area');
        });
    }
}

// Remove blur from all elements
function removeBlur() {
    const blurredElements = document.querySelectorAll('.weather-left, .weather-right > *, .day-forecast, .hourly-forecast');
    blurredElements.forEach(element => {
        element.style.filter = 'none';
        element.style.pointerEvents = 'auto';
    });
}

// Log out function to handle the logout button click
// Log out function to handle the logout button click
logoutBtn.addEventListener('click', () => {
    fetch('assets/uservalidation/logout.php') // Call server-side logout
        .then(response => {
            if (response.ok) {
                isLoggedIn = false; // Set login state to false
                updateAuthButtons(); // Update button visibility
                applyBlur(); // Reapply blur effect
                alert('Logged out'); // Optional message
            } else {
                console.error("Logout failed");
            }
        })
        .catch(error => console.error('Error during logout:', error));
});


// Check session on page load
window.onload = function () {
    checkSession(); // Verify login state on page load
};
