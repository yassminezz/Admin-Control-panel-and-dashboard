// const { get } = require("jquery");

// let $users =$(".card-text1");
// let $posts =$(".card-text2");
// let $comments =$(".card-text3");

// $.get(' https://jsonplaceholder.typicode.com/users',(data)=>{
//     let $d = data.ja
// $users.html('data');
// })


async function loadData() {
  let response1 = await fetch("https://jsonplaceholder.typicode.com/users");
  let users = await response1.json();

  let response2 = await fetch("https://jsonplaceholder.typicode.com/posts");
  let posts = await response2.json();

  let response3 = await fetch("https://jsonplaceholder.typicode.com/comments?postId=1");
  let comments = await response3.json();

  let p1 = document.querySelector(".card-text1");
  p1.innerHTML = `<i class="fa-solid fa-arrows-turn-right"></i> <b>${users.length}</b>`;

    let p2 = document.querySelector(".card-text2");
  p2.innerHTML = `<i class="fa-solid fa-arrows-turn-right"></i> <b>${posts.length}</b>`;

    let p3 = document.querySelector(".card-text3");
  p3.innerHTML = `<i class="fa-solid fa-arrows-turn-right"></i> <b>${comments.length}</b>`;
}
loadData();

// $.get(' https://jsonplaceholder.typicode.com/posts',(data)=>{

// })
//  $.get('https://jsonplaceholder.typicode.com/comments?postId=',(data)=>{

//  })
