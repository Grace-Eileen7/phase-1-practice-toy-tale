let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const form = document.querySelector(".add-toy-form");
  const TOYS_URL = "http://localhost:3000/toys";

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // ✅ 1. Fetch all toys
  fetch(TOYS_URL)
    .then((res) => res.json())
    .then((toys) => toys.forEach(renderToyCard));

  // ✅ 2. Render a single toy card
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      toy.likes += 1;
      updateLikes(toy);
    });

    toyCollection.appendChild(card);
  }

  // ✅ 3. Create new toy on form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = { name, image, likes: 0 };

    fetch(TOYS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((res) => res.json())
      .then((toy) => renderToyCard(toy));

    form.reset();
  });

  // ✅ 4. Update likes with PATCH
  function updateLikes(toy) {
    fetch(`${TOYS_URL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: toy.likes }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        const card = document.getElementById(updatedToy.id).parentElement;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }
});
