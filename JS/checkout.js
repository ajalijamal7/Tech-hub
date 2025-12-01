
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  let navDesc = document.getElementById('navLinks');    // links container
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navDesc.classList.toggle('open');
    });
  }
  renderCart()
});



document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();
  let allCarts = JSON.parse(localStorage.getItem("allCarts"))
  if (!sessionStorage.getItem("currentUser")) {
    document.getElementById("loginModal").style.display = "flex";
  } else {
    if (allCarts[currentUser.email]) {
      allCarts[currentUser.email] = []
      localStorage.setItem("allCarts",JSON.stringify(allCarts))
      renderCart()
      return alert("Order Placed!")
    }
    else {
      return alert("Your Cart is empty!")
    }
  }
});

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
}

const PCParts = JSON.parse(localStorage.getItem("PCParts")) || [];

const cartSection = document.querySelector(".cart-section");
let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

function renderCart() {


  if (!currentUser || !currentUser.email) {
    cartSection.innerHTML = "<h2>Your Cart</h2><p>Please log in to view your cart.</p>";
    updateSummary(0);
    updateCartCount();
    return;
  }

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || []
  cartSection.innerHTML = "<h2>Your Cart</h2>";

  if (cart.length === 0) {
    cartSection.innerHTML += "<p>Your cart is empty.</p>";
    updateSummary(0);
    updateCartCount()
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

    let controlsDiv = document.createElement("div");
    controlsDiv.classList.add("quantity-control");

    const qtySpan = document.createElement("span");
    qtySpan.textContent = product.quantity;

    if (product.quantity === 1) {
      const plusBtn = document.createElement("button");
      plusBtn.classList.add("quantity-btn");
      plusBtn.title = "Increase quantity";
      plusBtn.textContent = "+";
      plusBtn.onclick = () => changeQuantity(index, +1);

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.title = "Delete item";
      deleteBtn.innerHTML = `<img src="../HTML/img/icons8-delete-30.png"  alt="">`;
      deleteBtn.onclick = () => deleteItem(index);

      controlsDiv.appendChild(plusBtn);
      controlsDiv.appendChild(qtySpan);
      controlsDiv.appendChild(deleteBtn);

    } else {
      const plusBtn = document.createElement("button");
      plusBtn.classList.add("quantity-btn");
      plusBtn.title = "Increase quantity";
      plusBtn.textContent = "+";
      plusBtn.onclick = () => changeQuantity(index, +1);

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
  updateCartCount()
}

function updateSummary(subtotal) {
  const delivery = 5.00;
  const total = subtotal + delivery;

  document.querySelector(".summary-line:nth-child(1) span:last-child").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector(".summary-line:nth-child(2) span:last-child").textContent = `$${delivery.toFixed(2)}`;
  document.querySelector(".summary-line.total span:last-child").textContent = `$${total.toFixed(2)}`;
}



function updateCartCount() {
  let cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};

  let cart;

  if (currentUser && currentUser.email) {
    cart = allCarts[currentUser.email] || [];
  } else {
    cart = [];
  }



  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = totalQty;
  cartCount.style.display = totalQty > 0 ? "inline-block" : "none";
}



function deleteItem(index) {
  if (!currentUser || !currentUser.email) return;
  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || []
  cart.splice(index, 1);
  allCarts[currentUser.email] = cart
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
  allCarts[currentUser.email] = cart
  localStorage.setItem("allCarts", JSON.stringify(allCarts));
  renderCart();
}

function getAvailableStock(productName) {
  const product = PCParts.find(p => p.name === productName);
  return product ? product.quantity : 0;
}




