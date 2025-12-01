let PCParts = [];
let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));


$(document).ready(function() {
  initializeHomePage();
});

async function initializeHomePage() {
  await loadProducts();
  initializeEventListeners();
  displayFeaturedProducts();
  updateCartCount();
}

async function loadProducts() {
  try {
    let response = await fetch('data/products.json');
    let data = await response.json();
    PCParts = data.PCParts;
    localStorage.setItem("PCParts", JSON.stringify(PCParts));
  } catch (error) {
    console.error('Error loading products:', error);
    let storedProducts = localStorage.getItem("PCParts");
    if (storedProducts) {
      PCParts = JSON.parse(storedProducts);
    }
  }
}

function initializeEventListeners() {
  let $hamburger = $("#hamburger");
  let $navDesc = $('#navLinks');
  if ($hamburger.length) {
    $hamburger.on("click", function() {
      $navDesc.toggleClass('open');
    });
  }

  initializeCartAnimations();
}


function initializeCartAnimations() {
  $("body").on("click", ".add-to-cart", function(e) {
    let $btn = $(this);
    $btn.addClass("clicked");
    setTimeout(() => $btn.removeClass("clicked"), 300);

    let $card = $btn.closest(".product-card");
    if ($card.length) {
      $card.addClass("animate");
      setTimeout(() => $card.removeClass("animate"), 400);
    }
  });
}

function displayFeaturedProducts() {
  let $featuredGrid = $("#featured-products-grid");
  if (!$featuredGrid.length) return;

  let featuredProducts = PCParts.slice(0, 3); 

  let displayProducts = featuredProducts.map(part => `
    <article class="product-card">
      <a href="product.html?product=${encodeURIComponent(part.name)}" class="product-link">
        <img src="${"HTML/"+part.image}" alt="${part.name}" />
        <h3>${part.name}</h3>
      </a>
      <p class="price">$${part.price}</p>
      <button class="add-to-cart" data-product-name="${part.name}">Add to Cart</button>
    </article>
  `).join("");
  
  $featuredGrid.html(displayProducts);
}

// Cart functionality
function updateCartCount() {
  let $cartCount = $("#cart-count");
  if (!$cartCount.length) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = currentUser && currentUser.email ? allCarts[currentUser.email] || [] : [];
  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  $cartCount.text(totalQty);
  $cartCount.css("display", totalQty > 0 ? "inline-block" : "none");
}

// Event delegation for add to cart buttons
$(document).on("click", ".add-to-cart", function() {
  let productName = $(this).data("product-name");
  addToCartByName(productName);
});

function addToCartByName(productName) {
  if (!currentUser) {
    alert("Please login to add items to cart!");
    return;
  }

  let product = PCParts.find(p => p.name === productName);
  if (!product) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || [];

  let existing = cart.find(item => item.name === product.name);
  let currentQtyInCart = existing ? existing.quantity : 0;

  if (currentQtyInCart + 1 > product.quantity) {
    alert(`Sorry, only ${product.quantity} units of "${product.name}" are available.`);
    return;
  }

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  allCarts[currentUser.email] = cart;
  localStorage.setItem("allCarts", JSON.stringify(allCarts));
  updateCartCount();
  alert(`${product.name} added to cart`);
}