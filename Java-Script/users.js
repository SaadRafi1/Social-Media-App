class UserFetcher {
  constructor(url, targetElementId) {
    this.url = url;
    this.targetElementId = targetElementId;
  }

  async fetchUsers() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      const users = data.users;

      users.forEach((user) => {
        this.renderUser(user);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  renderUser(user) {
    const userElement = document.createElement("div");
    userElement.classList.add("datainfo");
    userElement.innerHTML = `
        <div class="message">
          <div class="users-photo">
            <img src="${user.image}" alt="" />
          </div>
          <div class="body-message ms-2">
            <h5>${user.firstName}</h5>
            <p class="text-muted">${user.username}</p>
          </div>
        </div>`;
    document.getElementById(this.targetElementId).appendChild(userElement);
  }
}
const userFetcher = new UserFetcher("https://dummyjson.com/users", "users");
userFetcher.fetchUsers();
