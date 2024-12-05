const pincodeInput = document.getElementById("pincode-input");
const lookupBtn = document.getElementById("lookup-btn");
const loader = document.getElementById("loader");
const filterContainer = document.querySelector(".filter-container");
const filterInput = document.getElementById("filter-input");
const results = document.getElementById("results");
const errorMessage = document.getElementById("error-message");
const noDataMessage = document.getElementById("no-data-message");

let postOffices = [];

lookupBtn.addEventListener("click", async () => {
  const pincode = pincodeInput.value.trim();

  if (!/^\d{6}$/.test(pincode)) {
    errorMessage.textContent = "Pincode must be a 6-digit number!";
    return;
  }

  errorMessage.textContent = "";
  noDataMessage.textContent = "";
  results.innerHTML = "";
  filterContainer.style.display = "none";
  loader.style.display = "flex";

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    loader.style.display = "none";

    if (data[0].Status !== "Success") {
      errorMessage.textContent = "Invalid Pincode or No data found!";
      return;
    }

    postOffices = data[0].PostOffice;
    displayResults(postOffices);
    filterContainer.style.display = "block";
  } catch (error) {
    loader.style.display = "none";
    errorMessage.textContent = "An error occurred. Please try again!";
  }
});

filterInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();
  const filteredOffices = postOffices.filter((office) =>
    office.Name.toLowerCase().includes(query)
  );

  if (filteredOffices.length === 0) {
    noDataMessage.textContent = "Couldn’t find the postal data you’re looking for...";
  } else {
    noDataMessage.textContent = "";
  }

  displayResults(filteredOffices);
});

function displayResults(offices) {
  results.innerHTML = "";

  offices.forEach((office) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <p><strong>Name:</strong> ${office.Name}</p>
      <p><strong>Pincode:</strong> ${office.Pincode}</p>
      <p><strong>District:</strong> ${office.District}</p>
      <p><strong>State:</strong> ${office.State}</p>
    `;
    results.appendChild(card);
  });
}