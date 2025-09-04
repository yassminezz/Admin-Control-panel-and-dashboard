// Fetch & show posts
// Fetch & show posts + comments
// Fetch & show posts + comments
// Fetch & show posts + comments
async function showPosts() {
  let response = await fetch("https://jsonplaceholder.typicode.com/posts");
  let postsLst = await response.json();

  let tbody = document.querySelector(".table-group-divider");
  tbody.innerHTML = "";

  for (let p of postsLst) {
    // Row للبوست نفسه
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.userId}</td>
      <td>${p.title}</td>
      <td>${p.body}</td>
      <td>
        <button class="toggle-comments btn btn-sm btn-secondary" data-postid="${p.id}">
          <i class="fa-solid fa-angle-down"></i>
        </button>
        <button class="edit bg-info rounded border border-1">
          <i class="fa-solid fa-pen text-white"></i>
        </button>
        <button class="delete ms-2 bg-danger rounded border border-1">
          <i class="fa-solid fa-trash text-white"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);

    // Row للكومنتات (مخفي في الأول)
    let commentsTr = document.createElement("tr");
    commentsTr.style.display = "none"; // مخفي
    commentsTr.innerHTML = `
      <td colspan="5">
        <div class="comments" id="comments-${p.id}">
          <em>Loading comments...</em>
        </div>
      </td>
    `;
    tbody.appendChild(commentsTr);

    // تحميل الكومنتات
    let commentsRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${p.id}/comments`);
    let comments = await commentsRes.json();

    let commentsDiv = commentsTr.querySelector(`#comments-${p.id}`);
    commentsDiv.innerHTML = comments.map(c => `
      <div class="border rounded p-2 mb-2">
        <strong>${c.name}</strong> <span class="text-muted">(${c.email})</span>
        <p>${c.body}</p>
      </div>
    `).join("");

    // زرار التوجل
    tr.querySelector(".toggle-comments").addEventListener("click", function () {
      if (commentsTr.style.display === "none") {
        commentsTr.style.display = "table-row";
        this.innerHTML = `<i class="fa-solid fa-angle-up"></i>`; // سهم لفوق
      } else {
        commentsTr.style.display = "none";
        this.innerHTML = `<i class="fa-solid fa-angle-down"></i>`; // سهم لتحت
      }
    });
  }
}


document.addEventListener("DOMContentLoaded", showPosts);

// Delete post
document.querySelector(".table-group-divider").addEventListener("click", async function (e) {
  if (e.target.closest(".delete")) {
    let row = e.target.closest("tr");
    let postId = row.children[0].textContent;

    if (confirm(`Delete post #${postId}?`)) {
      let response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        row.remove()
        toastr.success("Post deleted successfully!");
        toastr.options = {
          "closeButton": true,
          "progressBar": true,
          "positionClass": "toast-top-right",
          "timeOut": "3000"
        };

      };
    }
  }
});

// Add / Update post
document.getElementById("postForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  let postId = document.getElementById("postId").value;

  let postData = {
    userId: document.getElementById("userId").value,
    title: document.getElementById("title").value,
    body: document.getElementById("body").value
  };

  let url = "https://jsonplaceholder.typicode.com/posts";
  let method = "POST";

  if (postId) {
    url += `/${postId}`;
    method = "PUT";
  }

  let response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData)
  });

  let data = await response.json();

  if (postId) {
    // Update row
    let row = [...document.querySelectorAll("tbody tr")].find(tr => tr.children[0].textContent == postId);
    if (row) {
      row.children[1].textContent = postData.userId;
      row.children[2].textContent = postData.title;
      row.children[3].textContent = postData.body;
    }
    //toaster

    toastr.options = {
      "closeButton": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "timeOut": "3000"
    };
    toastr.success("Post Updated successfully!");
  } else {
    // Add new row
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.id || "New"}</td>
      <td>${postData.userId}</td>
      <td>${postData.title}</td>
      <td>${postData.body}</td>
      <td>
 
          <button class="edit bg-info rounded border border-1">
            <i class="fa-solid fa-pen text-white"></i>
          </button>
          <button class="delete ms-2 bg-danger rounded border border-1">
            <i class="fa-solid fa-trash text-white"></i>
          </button>
     
      </td>
    `;
    document.querySelector(".table-group-divider").appendChild(tr);
    // toaster
    toastr.success("Post Updated successfully!");
    toastr.options = {
      "closeButton": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "timeOut": "3000"
    }

  }

  // Reset form + close modal
  document.getElementById("postForm").reset();
  document.getElementById("postId").value = "";
  bootstrap.Modal.getInstance(document.getElementById("postModal")).hide();
});

// Edit post (fill modal)
document.querySelector(".table-group-divider").addEventListener("click", (e) => {
  if (e.target.closest(".edit")) {
    let row = e.target.closest("tr");

    document.getElementById("postId").value = row.children[0].textContent;
    document.getElementById("userId").value = row.children[1].textContent;
    document.getElementById("title").value = row.children[2].textContent;
    document.getElementById("body").value = row.children[3].textContent;

    new bootstrap.Modal(document.getElementById("postModal")).show();


  }
});




document.addEventListener("mouseover", function (e) {
  let icon = e.target.closest(".edit i, .delete i,.btn");
  if (icon) {
    icon.classList.add("animate__animated", "animate__swing");
    icon.addEventListener("animationend", () => {
      icon.classList.remove("animate__animated", "animate__swing");
    }, { once: true });
  }
});