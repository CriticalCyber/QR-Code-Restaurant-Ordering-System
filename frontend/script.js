const API_BASE = "http://10.147.185.125:5000";

function getTableFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("table") || "";
}

async function fetchMenu() {
  try {
    const res = await fetch(`${API_BASE}/menu`);
    const data = await res.json();

    const menuDiv = document.getElementById("menu");
    menuDiv.innerHTML = "";

    const fullItems = data.filter(item => item.category.toLowerCase() === "full");
    const halfItems = data.filter(item => item.category.toLowerCase() === "half");

    if (fullItems.length > 0) menuDiv.appendChild(renderSection("Full", fullItems));
    if (halfItems.length > 0) menuDiv.appendChild(renderSection("Half", halfItems));

  } catch (err) {
    console.error("Failed to load menu:", err);
    document.getElementById("menu").innerHTML = "Failed to load menu.";
  }
}

function renderSection(title, items) {
  const section = document.createElement("div");
  section.innerHTML = `<h3>${title} Items</h3>`;

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";

    div.innerHTML = `
      <span class="item-name clickable">${item.name}</span> - ₹${item.price}
      <div class="item-image" style="display:none; margin-top:8px;">
        ${item.image ? `<img src="${API_BASE}/uploads/${item.image}" alt="${item.name}" style="width:100px;height:auto;"><br/>` : ''}
      </div>
      <div>
        <input type="checkbox" value="${item.name}" />
      </div>
      <div class="qty-box">
        <button type="button" class="qty-btn" data-action="decrease" data-item="${item.name}">-</button>
        <input type="number" class="qty-input" value="1" min="1" data-item="${item.name}" />
        <button type="button" class="qty-btn" data-action="increase" data-item="${item.name}">+</button>
      </div>
    `;
    section.appendChild(div);
  });

  return section;
}

window.refreshCustomerMenuPage = fetchMenu;

window.onload = () => {
  fetchMenu();

  let selectedItems = [];
  let tableNumber = getTableFromURL();

  document.getElementById("order-btn").addEventListener("click", async (e) => {
    e.preventDefault();

    selectedItems = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map(cb => {
      const qtyInput = document.querySelector(`.qty-input[data-item='${cb.value}']`);
      const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
      return { name: cb.value, quantity };
    });

    if (selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    const noteElem = document.getElementById("order-note");
    const note = noteElem ? noteElem.value : "";

    try {
      const res = await fetch(`${API_BASE}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: tableNumber,
          items: selectedItems,
          note
        }),
      });

      const result = await res.json();
      document.getElementById("status").innerText = result.message || "Order placed!";
      document.getElementById("status").style.color = "green";

      setTimeout(() => { document.getElementById("status").innerText = ""; }, 3000);

      document.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);
      document.querySelectorAll(".qty-input").forEach(input => input.value = 1);
      if (noteElem) noteElem.value = "";

      // ✅ Show rating popup
      showRatingPopup();

    } catch (err) {
      console.error("Error placing order:", err);
      const statusElem = document.getElementById("status");
      statusElem.innerText = "Failed to place order.";
      statusElem.style.color = "red";
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("qty-btn")) {
      const action = e.target.dataset.action;
      const itemName = e.target.dataset.item;
      const qtyInput = document.querySelector(`.qty-input[data-item='${itemName}']`);
      let currentQty = parseInt(qtyInput.value);

      if (action === "increase") qtyInput.value = currentQty + 1;
      else if (action === "decrease" && currentQty > 1) qtyInput.value = currentQty - 1;
    }

    if (e.target.classList.contains("item-name")) {
      document.querySelectorAll('.item-image').forEach(imgDiv => imgDiv.style.display = 'none');

      const parent = e.target.closest('.menu-item');
      const imgDiv = parent.querySelector('.item-image');
      if (imgDiv) imgDiv.style.display = 'block';
    }
  });
};


// ==== ✅ RATING POPUP LOGIC ===== //
let selectedRating = 0;

function showRatingPopup() {
  document.getElementById("rating-popup").style.display = "flex";
}

document.getElementById("submit-rating").addEventListener("click", async () => {
  const feedback = document.getElementById("rating-feedback").value.trim();

  try {
    await fetch(`${API_BASE}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: selectedRating, feedback })
    });

    alert("Thanks for your feedback!");
    document.getElementById("rating-popup").style.display = "none";
    selectedRating = 0;
    updateStars();

  } catch (err) {
    console.error("Failed to submit rating", err);
  }
});

// Star click handling
document.getElementById("stars").addEventListener("click", (e) => {
  if (e.target.tagName === 'SPAN') {
    selectedRating = parseInt(e.target.dataset.value);
    updateStars();
  }
});

function updateStars() {
  document.querySelectorAll("#stars span").forEach(star => {
    const value = parseInt(star.dataset.value);
    star.className = (value <= selectedRating) ? 'selected' : '';
  });
}
