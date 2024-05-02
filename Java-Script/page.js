document.addEventListener("DOMContentLoaded", function () {
  const LoggedInUser = JSON.parse(localStorage.getItem("user"));
  if (!LoggedInUser) {
    window.location.href = "./index.html";
  }
});

/* Post Functionality for displayng Post*/
async function getPost() {
  try {
    let skip = 0;
    const limit = 10;

    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Load More";
    loadMoreButton.classList.add("load-more-button");
    loadMoreButton.style.display = "none";
    loadMoreButton.addEventListener("click", loadMorePosts);
    document.getElementById("api-post").appendChild(loadMoreButton);

    async function loadPosts() {
      const responsefromuser = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
      const dataofuser = await responsefromuser.json();
      const userpost = dataofuser.posts;

      for (let i = 0; i < userpost.length; i++) {
        const responseUser = await fetch(`https://dummyjson.com/users/${userpost[i].userId}`);
        const userData = await responseUser.json();
        const user = userData;

        const responseComments = await fetch(`https://dummyjson.com/comments/post/${userpost[i].id}`);
        const commentData = await responseComments.json();
        const comments = commentData.comments;

        const userElement = document.createElement("div");
        userElement.classList.add("info");
        const userImagefromlocal = JSON.parse(localStorage.getItem("user"));
        const userImageCommenting = userImagefromlocal.image;
        userElement.innerHTML = `<div class="feeds p-2">
          <div class="feed">
            <div class="head">
              <div class="user">
                <div class="user-feed-photo">
                  <img src=${user.image} alt="" />
                </div>
                <div class="info">
                  <h6>${user.username}</h6>
                  <small>Dubai,15min ago</small>
                </div>
              </div>
              <span class="edit">
                <i class="bi bi-three-dots"></i>
              </span>
            </div>
            <div class="photo">
              <img src="./images/claudio-schwarz-Uy62BdM4Mfw-unsplash.jpg" />
            </div>
            <div class="action-button">
              <div class="interaction-buttons ">
                <span> <i class="bi bi-heart"></i></span>
                <span><i class="bi bi-chat"></i></span>
                <span><i class="bi bi-share"></i></span>
              </div>
              <div class="bookmark">
                <span><i class="bi bi-bookmark"></i></span>
              </div>
            </div>
            <div class="liked-by">
              <span><img src="./stories-images/2212e781-4f2d-4369-b239-707311d56a39.jpg" /></span>
              <span><img src="./stories-images/MODEL TALK_ Interview With ZSOMBOR HAJDU + Exclusive Shoot.jpg" /></span>
              <span><img src="./stories-images/blue.jpg" /></span>
              <p style="margin-left: 15px">Liked By <b>Ernest Hackel</b> and <b>200 others</b></p>
            </div>
            <div class="caption">
              <p>
                <b>${user.username}:</b>  ${userpost[i].body}
              </p>
            </div>
            <div class="comments">
              ${
                comments.length > 0
                  ? comments
                      .map(
                        (comment) => `
                  <div class="comment-body">
                    <span><b>${comment.user.username}:</b> ${comment.body}</span>
                  </div>
                `
                      )
                      .join("")
                  : "No comments for this post"
              }
              <div id ="new-comment-${userpost[i].id}">
            
              </div>
              Total comments ${comments.length}
            </div>
           
          </div>
          <div class="comment-dialogue-box">
          <img src="${userImageCommenting}" alt="">
          <input id="CommentInputId-${userpost[i].id}" type="text" placeholder="Enter comment"/><i
            class="bi bi-send"
            onClick="addcomment(${userpost[i].id})"
          ></i>
        </div>
        </div>`;

        document.getElementById("api-post").insertBefore(userElement, loadMoreButton);
      }

      skip += limit;

      if (userpost.length < limit) {
        loadMoreButton.style.display = "none";
      } else {
        loadMoreButton.style.display = "block";
      }
    }

    loadPosts();
  } catch (error) {
    console.error("Error fetching from console", error);
  }
}

async function loadMorePosts() {
  await getPost();
}

getPost();

/* End of Showing Pst functionality */

/*  Adding comment to the post */
function addcomment(postId) {
  const commentDisplay = document.getElementById(`CommentInputId-${postId}`).value;

  fetch("https://dummyjson.com/comments/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: "This makes all sense to me!",
      postId: postId,
      userId: 5,
    }),
  })
    .then((res) => res.json())
    .then((addcommentDisplaytomComment) => {
      console.log(addcommentDisplaytomComment.body);

      const commentWrapper = document.getElementById(`new-comment-${postId}`);
      const newComment = document.createElement("div");
      newComment.classList.add("comment-wrapper");
      const user = JSON.parse(localStorage.getItem("user"));
      const userCommenting = user.username;
      const dropdownMenuId = `dropdownMenu-${postId}`;
      newComment.innerHTML = `
        <div class="addcomment" id="comment-cont">
          <div class="addcomment-content">
            <p id="addcomment"><b>${userCommenting}</b>:${commentDisplay}</p>
          </div>
          <div class="dropdown">
            <i class="bi bi-three-dots-vertical" onClick="toggleDropdownMenu('${dropdownMenuId}')"></i>
            <div class="dropdown-menu" id="${dropdownMenuId}">
              <!-- Dropdown menu items -->
              <span onClick="editcomment(${postId})">Edit comment</span>
              <span onClick="deleteComment(${postId})"> Delete Comment</span>
            </div>
          </div>
        </div>
      `;

      commentWrapper.appendChild(newComment);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
/*  End of Adding comment to the post */

/* Event listner for three dot drop down option when comment is being added*/
document.addEventListener("DOMContentLoaded", function () {
  var threeDotsIcon = document.querySelector(".bi.bi-three-dots-vertical");
  if (threeDotsIcon) {
    threeDotsIcon.addEventListener("click", toggleDropdownMenu);
  }
});

function toggleDropdownMenu(dropdownMenuId) {
  const dropdownMenu = document.getElementById(dropdownMenuId);
  if (dropdownMenu) {
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
  } else {
    console.error(`Dropdown menu with id '${dropdownMenuId}' not found.`);
  }
}

/* End  Event listner for three dot drop down option when comment is being added*/

/*   Editing comment on the post */
function editcomment(postId) {
  console.log(postId);
  fetch("https://dummyjson.com/comments/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: "I think I should shift to the moon",
    }),
  })
    .then((res) => res.json())
    .then((response) => {
      let edit = document.getElementById(`CommentInputId-${postId}`);
      console.log(edit);
      let editcomment = document.getElementById(`addcomment`);
      alert("comment edited");
      edit.value = editcomment.innerText;
    });
}

/*   End of Editing comment on the post */

/*   Deleting comment on the post */
function deleteComment(postId) {
  console.log(postId);
  fetch("https://dummyjson.com/comments/1", {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      let comment = document.getElementById("comment-cont");

      alert("Comment deleted");
    });
}

/*  End of  Deleting comment on the post */

/*  Searching Post by targeting body Element of post  */

function searchPost() {
  const searchInput = document.getElementById("search").value.trim();

  if (searchInput !== "") {
    searchPosts(searchInput);
  } else {
    console.log("Search is empty");
  }
}

async function searchPosts(query) {
  try {
    const response = await fetch(`https://dummyjson.com/posts/search?q=${query}`);
    const searchData = await response.json();
    const searchPosts = searchData.posts;

    const postImage = document.getElementById("api-post");
    postImage.innerHTML = "";

    for (let i = 0; i < searchPosts.length; i++) {
      const post = searchPosts[i];
      console.log(post.userId, "POst id");
      console.log(post.body, "here");

      const responseUser = await fetch(`https://dummyjson.com/users/${post.userId}`);
      const userData = await responseUser.json();

      console.log(userData, "USERDATA");

      const userElement = document.createElement("div");
      userElement.classList.add("feedPosts");
      userElement.innerHTML = `
           <div class="feeds p-2">
<div class="feed">
<div class="head">
  <div class="user">
    <div class="user-feed-photo">
      <img src="${userData.image}" alt="" />
    </div>
    <div class="info">
      <h6>${userData.username}</h6>
      <small>Dubai,15min ago</small>
    </div>
  </div>
  <span class="edit">
    <i class="bi bi-three-dots"></i>
  </span>
</div>
<div class="photo">
  <img src="./images/claudio-schwarz-Uy62BdM4Mfw-unsplash.jpg" />
</div>
<div class="action-button">
  <div class="interaction-buttons">
    <span><i class="bi bi-heart"></i></span>
    <span><i class="bi bi-chat"></i></span>
    <span><i class="bi bi-share"></i></span>
  </div>
  <div class="bookmark">
    <span><i class="bi bi-bookmark"></i></span>
  </div>
</div>
<div class="liked-by">
<span><img src="./stories-images/2212e781-4f2d-4369-b239-707311d56a39.jpg" /></span>
<span><img src="./stories-images/MODEL TALK_ Interview With ZSOMBOR HAJDU + Exclusive Shoot.jpg" /></span>
<span><img src="./stories-images/blue.jpg" /></span>
  <p>Liked By <b>Ernest Hackel</b> and <b>200 others</b></p>
</div>

<div class="caption">
  <p>
    <b>${userData.username}</b> ${post.body}
    
  </p>
</div>

<div class="comment-body">
  <span> <b>Alisa:</b> The picture is amazing</span>
</div>

<div class="comment-dialogue-box">
  <input id="postId" type="text" placeholder="Enter comment" /><i
    class="bi bi-send"
    onClick="addcomment()"
  ></i>
</div>
</div>
</div>
        `;
      postImage.appendChild(userElement);
    }
  } catch (error) {
    console.error("Error fetching search posts:", error);
  }
}

/*  End of Searching Post by targeting body Element of post  */

/* Setting images*/

const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("username").textContent = user.username;
document.getElementById("username-navbar").textContent = user.username;
document.getElementById("user-image").src = user.image;
document.getElementById("nav-user-image").src = user.image;
document.getElementById("message-box-image").src = user.image;
