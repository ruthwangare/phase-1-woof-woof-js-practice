// Get references to HTML elements
const dogBar = document.querySelector("#dog-bar");
const dogInfo = document.querySelector("#dog-info");
const filterButton = document.querySelector("#good-dog-filter");

// Set initial filter state
let filterOn = false;

// Function to render dog bar
function renderDogBar(pups) {
  // Clear existing content
  dogBar.innerHTML = "";

  // Filter pups based on filter state
  const filteredPups = filterOn ? pups.filter(pup => pup.isGoodDog) : pups;

  // Create span element for each pup and append to dog bar
  filteredPups.forEach(pup => {
    const span = document.createElement("span");
    span.textContent = pup.name;
    span.dataset.id = pup.id;
    dogBar.appendChild(span);
  });
}

// Function to render dog info
function renderDogInfo(pup) {
  // Clear existing content
  dogInfo.innerHTML = "";

  // Create HTML elements to display pup info
  const img = document.createElement("img");
  img.src = pup.image;
  const h2 = document.createElement("h2");
  h2.textContent = pup.name;
  const button = document.createElement("button");
  button.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";
  button.dataset.id = pup.id;

  // Append elements to dog info
  dogInfo.appendChild(img);
  dogInfo.appendChild(h2);
  dogInfo.appendChild(button);
}

// Function to toggle good dog status
function toggleGoodDog(id, isGoodDog) {
  fetch(`http://localhost:3000/pups/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isGoodDog })
  })
    .then(response => response.json())
    .then(pup => {
      const button = document.querySelector(`#dog-info button[data-id="${id}"]`);
      button.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";
    });
}

// Event listener for dog bar clicks
dogBar.addEventListener("click", event => {
  if (event.target.tagName === "SPAN") {
    const id = event.target.dataset.id;
    fetch(`http://localhost:3000/pups/${id}`)
      .then(response => response.json())
      .then(pup => {
        renderDogInfo(pup);
      });
  }
});

// Event listener for good/bad dog button clicks
dogInfo.addEventListener("click", event => {
  if (event.target.tagName === "BUTTON") {
    const id = event.target.dataset.id;
    const isGoodDog = event.target.textContent === "Good Dog!";
    toggleGoodDog(id, !isGoodDog);
  }
});

// Event listener for filter button clicks
filterButton.addEventListener("click", () => {
  filterOn = !filterOn;
  filterButton.textContent = filterOn ? "Filter good dogs: ON" : "Filter good dogs: OFF";
  renderDogBar(pups);
});

// Fetch pups and render dog bar
let pups = [];
fetch("http://localhost:3000/pups")
  .then(response => response.json())
  .then(data => {
    pups = data;
    renderDogBar(pups);
  });
