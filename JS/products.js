// Global variables
let PCParts = [];
let Products_grid = $(".product-grid");
let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

// Initialize application
$(document).ready(function() {
  initializeApp();
});

async function initializeApp() {
  await loadProducts();
  initializeEventListeners();
  displayItems(PCParts);
  updateCartCount();
}

// Load products from JSON
async function loadProducts() {
  try {
    let response = await fetch('../data/products.json');
    let data = await response.json();
    PCParts = data.PCParts;
    localStorage.setItem("PCParts", JSON.stringify(PCParts));
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback to localStorage if available
    let storedProducts = localStorage.getItem("PCParts");
    if (storedProducts) {
      PCParts = JSON.parse(storedProducts);
    }
  }
}

// Initialize all event listeners
function initializeEventListeners() {
  // Hamburger menu
  let $hamburger = $("#hamburger");
  let $navDesc = $('#navLinks');
  if ($hamburger.length) {
    $hamburger.on("click", function() {
      $navDesc.toggleClass('open');
    });
  }

  // Filter toggle
  let $filterToggle = $('.filter-toggle');
  let $filters = $('.filters');
  if ($filterToggle.length && $filters.length) {
    $filterToggle.on('click', function() {
      $filters.toggleClass('active');
      $filterToggle.text($filters.hasClass('active') 
        ? 'Hide Filters' 
        : 'Show Filters');
    });
  }

  // Filter events
  $('input[name="brand"], input[name="category"]').on("change", applyFilters);

  // Search functionality
  initializeSearch();
  
  // Cart animation
  initializeCartAnimations();
}

// Search functionality
function initializeSearch() {
  let $searchBarInput = $("#search-bar");
  let $searchHeaderBarInput = $("#header-search-input");

  if ($searchBarInput.length) {
    $searchBarInput.on("input", handleSearch);
  }

  if ($searchHeaderBarInput.length) {
    $searchHeaderBarInput.on("input", handleSearch);
  }

  function handleSearch(event) {
    let searchTerm = $(event.target).val().toUpperCase();
    let searchedItems = PCParts.filter(part => 
      searchTerm === "" || part.name.toUpperCase().includes(searchTerm)
    );
    displayItems(searchedItems);
  }
}

// Cart animations
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

// Display products in grid
function displayItems(PCPartsArray) {
  if (!Products_grid.length) return;
  
  let displayProducts = PCPartsArray.map(part => `
    <article class="product-card">
      <a href="product.html?product=${encodeURIComponent(part.name)}" class="product-link">
        <img src="${part.image}" alt="${part.name}" />
        <h3>${part.name}</h3>
      </a>
      <p class="price">$${part.price}</p>
      <button class="add-to-cart" onclick="addToCartByName('${part.name}')">Add to Cart</button>
    </article>
  `).join("");
  
  Products_grid.html(displayProducts);
}

// Filter products
function getSelectedFilters() {
  let selectedBrand = $('input[name="brand"]:checked').val() || "ALL";
  let selectedCategory = $('input[name="category"]:checked').val() || "ALL";
  return { 
    brand: selectedBrand.toUpperCase(), 
    category: selectedCategory.toUpperCase() 
  };
}

function applyFilters() {
  let { brand, category } = getSelectedFilters();

  let filteredItems = PCParts.filter(part => {
    let brandMatch = (brand === "ALL") || (part.brand.toUpperCase() === brand);
    let categoryMatch = (category === "ALL") || (part.category.toUpperCase() === category);
    return brandMatch && categoryMatch;
  });

  displayItems(filteredItems);
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