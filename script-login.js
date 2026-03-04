const login = document.querySelector(".login-form");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("mode") === "register") {
  login.classList.add("active");
}

registerBtn.addEventListener("click", () => {
  login.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  login.classList.remove("active");
});

const registerForm = document.querySelector(".form-box.register form");
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = registerForm.querySelector('input[type="text"]').value;
  const email = registerForm.querySelector('input[type="email"]').value;
  const password = registerForm.querySelector('input[type="password"]').value;

  if (!username || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.find(
    (user) => user.username === username || user.email === email,
  );
  if (existingUser) {
    alert("User already exists!");
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify({ username }));
  alert("Registration successful!");
  registerForm.reset();
  login.classList.remove("active");
  window.location = "index.html";
});

const loginForm = document.querySelector(".form-box.login form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = loginForm.querySelector('input[type="text"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  if (!username || !password) {
    alert("Please fill in all fields!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (user) => user.username === username && user.password === password,
  );
  if (user) {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ username: user.username }),
    );
    alert("Login successful!");
    loginForm.reset();
    window.location = "index.html";
  } else {
    alert("Invalid credentials!");
  }
});