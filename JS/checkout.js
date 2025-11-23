
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  let navDesc   = document.getElementById('navLinks');    // links container
  if (hamburger) {
    hamburger.addEventListener("click", function () {
       navDesc.classList.toggle('open');
    });
  }
});



  document.getElementById("checkout-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!sessionStorage.getItem("currentUser")) {
      document.getElementById("loginModal").style.display = "flex";
    } else {
      alert("Order placed!");
    }
  });

  function closeModal() {
    document.getElementById("loginModal").style.display = "none";
  }

  // Load PCParts from localStorage (make sure you store it there on your products page)
const PCParts = JSON.parse(localStorage.getItem("PCParts")) || [];

// Cache cart container
const cartSection = document.querySelector(".cart-section");
let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

function renderCart() {
  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || []
  cartSection.innerHTML = "<h2>Your Cart</h2>";

  if (cart.length === 0) {
    cartSection.innerHTML += "<p>Your cart is empty.</p>";
    updateSummary(0);
    return;
  }

  let subtotal = 0;

  cart.forEach((product, index) => {
    subtotal += product.price * product.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("cart-item-details");
    detailsDiv.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
    `;

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;

    // Quantity control container
    let controlsDiv = document.createElement("div");
    controlsDiv.classList.add("quantity-control");

    const qtySpan = document.createElement("span");
    qtySpan.textContent = product.quantity;

    if (product.quantity === 1) {
      // Plus button (top)
      const plusBtn = document.createElement("button");
      plusBtn.classList.add("quantity-btn");
      plusBtn.title = "Increase quantity";
      plusBtn.textContent = "+";
      plusBtn.onclick = () => changeQuantity(index, +1);

      // Trash button (bottom)
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.title = "Delete item";
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.onclick = () => deleteItem(index);

      controlsDiv.appendChild(plusBtn);
      controlsDiv.appendChild(qtySpan);
      controlsDiv.appendChild(deleteBtn);

    } else {
      // Plus button (top)
      const plusBtn = document.createElement("button");
      plusBtn.classList.add("quantity-btn");
      plusBtn.title = "Increase quantity";
      plusBtn.textContent = "+";
      plusBtn.onclick = () => changeQuantity(index, +1);

      // Minus button (bottom)
      const minusBtn = document.createElement("button");
      minusBtn.classList.add("quantity-btn");
      minusBtn.title = "Decrease quantity";
      minusBtn.textContent = "-";
      minusBtn.onclick = () => changeQuantity(index, -1);

      controlsDiv.appendChild(plusBtn);
      controlsDiv.appendChild(qtySpan);
      controlsDiv.appendChild(minusBtn);
    }

    itemDiv.appendChild(img);
    itemDiv.appendChild(detailsDiv);
    itemDiv.appendChild(controlsDiv);

    cartSection.appendChild(itemDiv);
  });

  updateSummary(subtotal);
}

function updateSummary(subtotal) {
  const delivery = 5.00;
  const total = subtotal + delivery;

  document.querySelector(".summary-line:nth-child(1) span:last-child").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector(".summary-line:nth-child(2) span:last-child").textContent = `$${delivery.toFixed(2)}`;
  document.querySelector(".summary-line.total span:last-child").textContent = `$${total.toFixed(2)}`;
}

function deleteItem(index) {
  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || []
  cart.splice(index, 1);
  allCarts[currentUser]=cart
  localStorage.setItem("allCarts", JSON.stringify(allCarts));
  renderCart();
}

function changeQuantity(index, delta) {
  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || []
  let product = cart[index];
  if (!product) return;

  const availableStock = getAvailableStock(product.name);
  const newQty = product.quantity + delta;

  if (newQty < 1) {
    deleteItem(index);
    return;
  }

  if (newQty > availableStock) {
    alert(`Only ${availableStock} units of ${product.name} available in stock.`);
    return;
  }

  product.quantity = newQty;
  cart[index] = product;
  allCarts[currentUser]=cart  
  localStorage.setItem("allCarts", JSON.stringify(allCarts));
  renderCart();
}

function getAvailableStock(productName) {
  const product = PCParts.find(p => p.name === productName);
  return product ? product.quantity : 0;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});


