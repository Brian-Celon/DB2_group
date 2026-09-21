const API_URL = "https://db2-group.onrender.com";


const registerForm = document.getElementById("register_Form");
const loginForm = document.getElementById("login_Form");

if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const fullName = document.getElementById("full_name").value;
        const email = document.getElementById("register_email").value;
        const password = document.getElementById("register_password").value;

        const response = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        alert(data.message);
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("login_email").value;
        const password = document.getElementById("login_password").value;

        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem("isLoggedIn", "true");
            window.location.href = "landing.html";
        } else {
            alert(data.message);
        }
    });
}

// Session Auth Protection & Logout
if (document.body.classList.contains("landing-page")) {
    if (!sessionStorage.getItem("isLoggedIn")) {
        window.location.href = "index.html";
    }
}

const logoutBtn = document.getElementById("logout_btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        sessionStorage.removeItem("isLoggedIn");
    });
}

// Password Visibility Toggle Logic
function setupPasswordToggle(toggleBtnId, inputId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const passwordInput = document.getElementById(inputId);

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener("click", function () {
            const isPassword = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", isPassword ? "text" : "password");
            
            const icon = toggleBtn.querySelector("i");
            if (icon) {
                if (isPassword) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                } else {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
            }
        });
    }
}

setupPasswordToggle("toggle_login_password", "login_password");
setupPasswordToggle("toggle_register_password", "register_password");