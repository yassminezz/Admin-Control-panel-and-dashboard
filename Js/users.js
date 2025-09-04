
//initially show all users in api
async function showUsers() {
  let response = await fetch('https://jsonplaceholder.typicode.com/users');
  let usersLst = await response.json();

  let tbody = document.querySelector(".table-group-divider");
  tbody.innerHTML = ""; // clear table before filling

  usersLst.forEach(u => {
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.address.city}, ${u.address.street}</td>
      <td>${u.phone}</td>
      <td>${u.website}</td>
      <td>${u.company.name}</td>
      <td >
      <div class ="actions d-flex justify-content-around">
            <button class="edit bg-info rounded border border-1"> <i class="fa-solid fa-user-pen text-white"></i></button>
       <button class="delete ms-2 bg-danger rounded border border-1"><i class="fa-solid fa-trash text-white"></i> </button>
      </div>

      </td>
    `;
    tbody.appendChild(tr);
  });
}


document.addEventListener("DOMContentLoaded", showUsers);



//delete user 

let tbody = document.querySelector(".table-group-divider");

tbody.addEventListener("click", async function(e) {

    toastr.options = {
      "closeButton": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "timeOut": "3000"
    };

  if (e.target.closest(".delete")) {
    let row = e.target.closest("tr");   
    let userId = row.querySelector("td").textContent; 

    if (confirm(`Are you sure you want to delete user #${userId}?`)) {
      try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
          method: "DELETE"
        });

        if (response.ok) {
          console.log(`User ${userId} deleted`);
          row.remove();
              //toaster

  
    toastr.success("User removed successfully!");
        } else {
          console.error("Delete failed", response.status);
          toastr.error("Failed to delete User");
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  }
});

// Update user  and add user


document.getElementById("userForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  toastr.options = {
      "closeButton": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "timeOut": "3000"
    };
  let userId = document.getElementById("userId").value; // blank if Add, filled if Edit

  // Collect form values
  let userData = {
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
    website: document.getElementById("website").value,
    company: document.getElementById("company").value
  };

  let url = "https://jsonplaceholder.typicode.com/users";
  let method = "POST";

  if (userId) { // Editing
    url += `/${userId}`;
    method = "PUT";
  }

  try {
    let response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    let data = await response.json();
    console.log("Saved:", data);

    if (userId) {
      // Update row in table
      let row = [...document.querySelectorAll("tbody tr")]
        .find(tr => tr.children[0].textContent == userId);

      if (row) {
        row.children[1].textContent = userData.name;
        row.children[2].textContent = userData.username;
        row.children[3].textContent = userData.email;
        row.children[4].textContent = userData.address;
        row.children[5].textContent = userData.phone;
        row.children[6].textContent = userData.website;
        row.children[7].textContent = userData.company;
            //toaster

    toastr.success("User Updated successfully!");
      }
      // Reset form & close modal
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
 
 
    } else {
      // Add new row
      let tbody = document.querySelector(".table-group-divider");
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.id || "New"}</td>
        <td>${userData.name}</td>
        <td>${userData.username}</td>
        <td>${userData.email}</td>
        <td>${userData.address}</td>
        <td>${userData.phone}</td>
        <td>${userData.website}</td>
        <td>${userData.company}</td>
        <td>
          <div class="actions d-flex justify-content-around">
            <button class="edit bg-info rounded border border-1">
              <i class="fa-solid fa-user-pen text-white"></i>
            </button>
            <button class="delete ms-2 bg-danger rounded border border-1">
              <i class="fa-solid fa-trash text-white"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
          //toaster

    toastr.success("User Added successfully!");
    }
     

    // Reset form & close modal
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();

  } catch (error) {
    console.error("Error:", error);
  }
});


document.querySelector(".table-group-divider").addEventListener("click", (e) => {
  if (e.target.closest(".edit")) {
    let row = e.target.closest("tr");
    let id = row.children[0].textContent;
    document.getElementById("userId").value = id;
    document.getElementById("name").value = row.children[1].textContent;
    document.getElementById("username").value = row.children[2].textContent;
    document.getElementById("email").value = row.children[3].textContent;
    document.getElementById("address").value = row.children[4].textContent;
    document.getElementById("phone").value = row.children[5].textContent;
    document.getElementById("website").value = row.children[6].textContent;
    document.getElementById("company").value = row.children[7].textContent;

    new bootstrap.Modal(document.getElementById("addUserModal")).show();
  }
});
// Swing animation on hover for edit & delete icons
document.addEventListener("mouseover", function(e) {
  let icon = e.target.closest(".edit i, .delete i,.btn"); 
  if (icon) {
    icon.classList.add("animate__animated", "animate__swing");
    icon.addEventListener("animationend", () => {
      icon.classList.remove("animate__animated", "animate__swing");
    }, { once: true });
  }
});


/////////////////////


