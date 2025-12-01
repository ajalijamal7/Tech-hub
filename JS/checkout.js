$(document).ready(function () {
  let hamburger = $("#hamburger");
  let navDesc = $('#navLinks');    // links container
  if (hamburger.length) {
    hamburger.on("click", function () {
      navDesc.toggleClass('open');
    });
  }
  renderCart()
});

$("#checkout-form").on("submit", function (e) {
  e.preventDefault();
  let allCarts = JSON.parse(localStorage.getItem("allCarts"))
  if (!sessionStorage.getItem("currentUser")) {
    $("#loginModal").css("display", "flex");
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
  $("#loginModal").css("display", "none");
}

let PCParts = JSON.parse(localStorage.getItem("PCParts")) || [];

let cartSection = $(".cart-section");
let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

function renderCart() {
  if (!currentUser || !currentUser.email) {
    cartSection.html("<h2>Your Cart</h2><p>Please log in to view your cart.</p>");
    updateSummary(0);
    updateCartCount();
    return;
  }

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || []
  cartSection.html("<h2>Your Cart</h2>");

  if (cart.length === 0) {
    cartSection.append("<p>Your cart is empty.</p>");
    updateSummary(0);
    updateCartCount()
    return;
  }

  let subtotal = 0;

  cart.forEach((product, index) => {
    subtotal += product.price * product.quantity;

    let itemDiv = $("<div>").addClass("cart-item");

    let detailsDiv = $("<div>").addClass("cart-item-details").html(`
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
    `);

    let img = $("<img>").attr({
      src: product.image,
      alt: product.name
    });

    let controlsDiv = $("<div>").addClass("quantity-control");

    let qtySpan = $("<span>").text(product.quantity);

    if (product.quantity === 1) {
      let plusBtn = $("<button>").addClass("quantity-btn")
        .attr("title", "Increase quantity")
        .text("+")
        .on("click", () => changeQuantity(index, +1));

      let deleteBtn = $("<button>").addClass("delete-btn")
        .attr("title", "Delete item")
        .html(`<img src="../HTML/img/icons8-delete-30.png" alt="">`)
        .on("click", () => deleteItem(index));

      controlsDiv.append(plusBtn, qtySpan, deleteBtn);
    } else {
      let plusBtn = $("<button>").addClass("quantity-btn")
        .attr("title", "Increase quantity")
        .text("+")
        .on("click", () => changeQuantity(index, +1));

      let minusBtn = $("<button>").addClass("quantity-btn")
        .attr("title", "Decrease quantity")
        .text("-")
        .on("click", () => changeQuantity(index, -1));

      controlsDiv.append(plusBtn, qtySpan, minusBtn);
    }

    itemDiv.append(img, detailsDiv, controlsDiv);
    cartSection.append(itemDiv);
  });

  updateSummary(subtotal);
  updateCartCount()
}

function updateSummary(subtotal) {
  let delivery = 5.00;
  let total = subtotal + delivery;

  $(".summary-line:nth-child(1) span:last-child").text(`$${subtotal.toFixed(2)}`);
  $(".summary-line:nth-child(2) span:last-child").text(`$${delivery.toFixed(2)}`);
  $(".summary-line.total span:last-child").text(`$${total.toFixed(2)}`);
}

function updateCartCount() {
  let cartCount = $("#cart-count");
  if (!cartCount.length) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = (currentUser && currentUser.email) ? allCarts[currentUser.email] || [] : [];
  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.text(totalQty);
  cartCount.css("display", totalQty > 0 ? "inline-block" : "none");
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

  let availableStock = getAvailableStock(product.name);
  let newQty = product.quantity + delta;

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
  let product = PCParts.find(p => p.name === productName);
  return product ? product.quantity : 0;
}