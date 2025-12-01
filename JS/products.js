// Global variables
let PCParts = [];
const Products_grid = document.querySelector(".product-grid");
let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
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
    const response = await fetch('../data/products.json');
    const data = await response.json();
    PCParts = data.PCParts;
    localStorage.setItem("PCParts", JSON.stringify(PCParts));
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback to localStorage if available
    const storedProducts = localStorage.getItem("PCParts");
    if (storedProducts) {
      PCParts = JSON.parse(storedProducts);
    }
  }
}

// Initialize all event listeners
function initializeEventListeners() {
  // Hamburger menu
  const hamburger = document.getElementById("hamburger");
  const navDesc = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navDesc.classList.toggle('open');
    });
  }

  // Filter toggle
  const filterToggle = document.querySelector('.filter-toggle');
  const filters = document.querySelector('.filters');
  if (filterToggle && filters) {
    filterToggle.addEventListener('click', function () {
      filters.classList.toggle('active');
      filterToggle.textContent = filters.classList.contains('active') 
        ? 'Hide Filters' 
        : 'Show Filters';
    });
  }

  // Filter events
  document.querySelectorAll('input[name="brand"], input[name="category"]').forEach(input => {
    input.addEventListener("change", applyFilters);
  });

  // Search functionality
  initializeSearch();
  
  // Cart animation
  initializeCartAnimations();
}

// Search functionality
function initializeSearch() {
  const searchBarInput = document.getElementById("search-bar");
  const searchHeaderBarInput = document.getElementById("header-search-input");

  if (searchBarInput) {
    searchBarInput.addEventListener("input", handleSearch);
  }

  if (searchHeaderBarInput) {
    searchHeaderBarInput.addEventListener("input", handleSearch);
  }

  function handleSearch(event) {
    const searchTerm = event.target.value.toUpperCase();
    const searchedItems = PCParts.filter(part => 
      searchTerm === "" || part.name.toUpperCase().includes(searchTerm)
    );
    displayItems(searchedItems);
  }
}

// Cart animations
function initializeCartAnimations() {
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const btn = e.target;
      btn.classList.add("clicked");
      setTimeout(() => btn.classList.remove("clicked"), 300);

      const card = btn.closest(".product-card");
      if (card) {
        card.classList.add("animate");
        setTimeout(() => card.classList.remove("animate"), 400);
      }
    }
  });
}

// Display products in grid
function displayItems(PCPartsArray) {
  if (!Products_grid) return;
  
  const displayProducts = PCPartsArray.map(part => `
    <article class="product-card">
      <a href="product.html?product=${encodeURIComponent(part.name)}" class="product-link">
        <img src="${part.image}" alt="${part.name}" />
        <h3>${part.name}</h3>
      </a>
      <p class="price">$${part.price}</p>
      <button class="add-to-cart" onclick="addToCartByName('${part.name}')">Add to Cart</button>
    </article>
  `).join("");
  
  Products_grid.innerHTML = displayProducts;
}

// Filter products
function getSelectedFilters() {
  const selectedBrand = document.querySelector('input[name="brand"]:checked')?.value || "ALL";
  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || "ALL";
  return { 
    brand: selectedBrand.toUpperCase(), 
    category: selectedCategory.toUpperCase() 
  };
}

function applyFilters() {
  const { brand, category } = getSelectedFilters();

  const filteredItems = PCParts.filter(part => {
    const brandMatch = (brand === "ALL") || (part.brand.toUpperCase() === brand);
    const categoryMatch = (category === "ALL") || (part.category.toUpperCase() === category);
    return brandMatch && categoryMatch;
  });

  displayItems(filteredItems);
}

// Cart functionality
function updateCartCount() {
  let cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = currentUser && currentUser.email ? allCarts[currentUser.email] || [] : [];
  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = totalQty;
  cartCount.style.display = totalQty > 0 ? "inline-block" : "none";
}

function addToCartByName(productName) {
  if (!currentUser) {
    alert("Please login to add items to cart!");
    return;
  }

  const product = PCParts.find(p => p.name === productName);
  if (!product) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || [];

  const existing = cart.find(item => item.name === product.name);
  const currentQtyInCart = existing ? existing.quantity : 0;

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