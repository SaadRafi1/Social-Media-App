class LoginForm {
  constructor() {
    this.form = document.getElementById("form");
    this.usernameInput = document.getElementById("username");
    this.passwordInput = document.getElementById("password");

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    const username = this.usernameInput.value;
    const password = this.passwordInput.value;

    this.login(username, password);
  }

  login(username, password) {
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        expiresInMins: 30,
      }),
    })
      .then((res) => res.json())
      .then(this.handleLoginResponse.bind(this))
      .catch(this.handleError.bind(this));
  }

  handleLoginResponse(loginData) {
    if (loginData.token) {
      localStorage.setItem("user", JSON.stringify(loginData));
      console.log("Token generated:", loginData.token);
      window.location.href = "./page.html";
    } else {
      swal("Login Failed", "Incorrect username or password!", "error");
      console.log("Login failed for user:", username);
    }
  }

  handleError(error) {
    console.error("Error:", error);
    swal("Error", "An error occurred while processing your request. Please try again later.", "error");
  }
}

const loginForm = new LoginForm();

