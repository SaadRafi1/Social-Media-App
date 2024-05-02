function logout() {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout!",
    width: "350px",
    iconColor: "#333",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "./index.html";
      localStorage.removeItem("user");
    }
  });
}

function tokeCheck() {
  if (!user.token) {
    window.location.href = "./index.html";
  }
}

let submenu = document.getElementById("submenu");
function toggleMenu() {
  submenu.classList.toggle("open-menu");
}
