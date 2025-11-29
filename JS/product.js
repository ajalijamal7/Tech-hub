document.addEventListener("DOMContentLoaded", function () {
  // Hamburger menu functionality
  let hamburger = document.getElementById("hamburger");
  let navDesc = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navDesc.classList.toggle('open');
    });
  }

  // Get product data from URL parameters
  let urlParams = new URLSearchParams(window.location.search);
  let productName = urlParams.get('product');

  if (!productName) {
    // Redirect back to products if no product specified
    window.location.href = 'products.html';
    return;
  }

  // Load product data
  let PCParts = JSON.parse(localStorage.getItem("PCParts")) || [];
  let product = PCParts.find(p => p.name === decodeURIComponent(productName));

  if (!product) {
    // Product not found, redirect to products
    window.location.href = 'products.html';
    return;
  }

  // Display product details
  displayProductDetails(product);

  // Load related products
  displayRelatedProducts(product, PCParts);

  // Setup event listeners
  setupEventListeners(product);

  // Update cart count
  updateCartCount();
});

function displayProductDetails(product) {
  // Set page title
  document.title = `${product.name} - TechHub`;

  // Set breadcrumb
  let productCategory = document.getElementById('product-category');
  let productNameBreadcrumb = document.getElementById('product-name-breadcrumb');
  productCategory.textContent = product.category;
  productNameBreadcrumb.textContent = product.name;

  // Set main product details
  let productImage = document.getElementById('product-image');
  let productTitle = document.getElementById('product-title');
  let productBrand = document.getElementById('product-brand');
  let productCategoryFull = document.getElementById('product-category-full');
  let productPrice = document.getElementById('product-price');

  productImage.src = product.image;
  productImage.alt = product.name;
  productTitle.textContent = product.name;
  productBrand.textContent = product.brand;
  productCategoryFull.textContent = product.category;
  productPrice.textContent = `$${product.price}`;

  // Set stock information
  let stockElement = document.getElementById('product-stock');
  stockElement.textContent = `${product.quantity} in stock`;
  if (product.quantity < 5) {
    stockElement.classList.add('low');
  }
  if (product.quantity === 0) {
    stockElement.classList.add('out');
    stockElement.textContent = 'Out of stock';
  }

  // Set description
  let productDescription = document.getElementById('product-description');
  productDescription.textContent = product.desc;

  // Generate feature list from description
  generateFeatureList(product.desc);
}

function generateFeatureList(description) {
  let featureList = document.getElementById('feature-list');
  let sentences = description.split('. ').filter(sentence => sentence.trim().length > 0);

  featureList.innerHTML = '';
  sentences.forEach(sentence => {
    if (sentence.trim()) {
      let li = document.createElement('li');
      li.textContent = sentence + (sentence.endsWith('.') ? '' : '.');
      featureList.appendChild(li);
    }
  });
}

function displayRelatedProducts(currentProduct, allProducts) {
  let relatedProductsGrid = document.getElementById('related-products');

  // Find related products (same category, different product)
  let relatedProducts = allProducts.filter(product =>
    product.category === currentProduct.category &&
    product.name !== currentProduct.name
  ).slice(0, 4); // Show max 4 related products

  if (relatedProducts.length === 0) {
    relatedProductsGrid.innerHTML = '<p>No related products found.</p>';
    return;
  }

  let relatedProductsHTML = relatedProducts.map(product => `
    <a href="product.html?product=${encodeURIComponent(product.name)}" class="related-product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p class="price">$${product.price}</p>
    </a>
  `).join('');

  relatedProductsGrid.innerHTML = relatedProductsHTML;
}

function setupEventListeners(product) {
  // Quantity controls
  let quantityInput = document.getElementById('quantity');
  let decreaseBtn = document.getElementById('decrease-qty');
  let increaseBtn = document.getElementById('increase-qty');

  decreaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue < Math.min(10, product.quantity)) {
      quantityInput.value = currentValue + 1;
    }
  });

  // Add to cart button
  let addToCartBtn = document.getElementById('add-to-cart-detail');
  addToCartBtn.addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    addToCart(product, quantity);
  });

  // Buy now button
  let buyNowBtn = document.getElementById('buy-now');
  buyNowBtn.addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    addToCart(product, quantity)
    window.location.href = '../HTML/checkout.html';
  });
}

function addToCart(product, quantity) {
  let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
  if (!currentUser) return alert("Please login!")
  console.log(currentUser)

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || []
  const existing = cart.find(item => item.name === product.name);

  const currentQtyInCart = existing ? existing.quantity : 0;


  if (currentQtyInCart + quantity > product.quantity) {
    return alert(`Sorry, only ${product.quantity} units of "${product.name}" are available.`);
  }

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity: quantity });
  }
  allCarts[currentUser.email] = cart
  localStorage.setItem("allCarts", JSON.stringify(allCarts));
  let addToCartBtn = document.getElementById('add-to-cart-detail');
  addToCartBtn.classList.add('added');
  addToCartBtn.textContent = '✓ Added to Cart';

  setTimeout(() => {
    addToCartBtn.classList.remove('added');
    addToCartBtn.textContent = 'Add to Cart';
  }, 2000);

  updateCartCount();

  alert(`${quantity} ${product.name} added to cart`);
}



function updateCartCount() {
  let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

  let cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};

  let cart;

  if (currentUser && currentUser.email) {
    cart = allCarts[currentUser.email] || [];
  } else {
    cart = []; // guest user
  }



  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = totalQty;
  cartCount.style.display = totalQty > 0 ? "inline-block" : "none";
}
