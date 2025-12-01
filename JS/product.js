$(document).ready(function () {
  // Hamburger menu functionality
  let $hamburger = $("#hamburger");
  let $navDesc = $('#navLinks');
  if ($hamburger.length) {
    $hamburger.on("click", function () {
      $navDesc.toggleClass('open');
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
  $('#product-category').text(product.category);
  $('#product-name-breadcrumb').text(product.name);

  // Set main product details
  $('#product-image').attr({
    src: product.image,
    alt: product.name
  });
  $('#product-title').text(product.name);
  $('#product-brand').text(product.brand);
  $('#product-category-full').text(product.category);
  $('#product-price').text(`$${product.price}`);

  // Set stock information
  let $stockElement = $('#product-stock');
  $stockElement.text(`${product.quantity} in stock`);
  
  $stockElement.removeClass('low out');
  if (product.quantity < 5) {
    $stockElement.addClass('low');
  }
  if (product.quantity === 0) {
    $stockElement.addClass('out');
    $stockElement.text('Out of stock');
  }

  // Set description
  $('#product-description').text(product.desc);

  // Generate feature list from description
  generateFeatureList(product.desc);
}

function generateFeatureList(description) {
  let $featureList = $('#feature-list');
  let sentences = description.split('. ').filter(sentence => sentence.trim().length > 0);

  $featureList.empty();
  sentences.forEach(sentence => {
    if (sentence.trim()) {
      $featureList.append(`<li>${sentence}${sentence.endsWith('.') ? '' : '.'}</li>`);
    }
  });
}

function displayRelatedProducts(currentProduct, allProducts) {
  let $relatedProductsGrid = $('#related-products');

  // Find related products (same category, different product)
  let relatedProducts = allProducts.filter(product =>
    product.category === currentProduct.category &&
    product.name !== currentProduct.name
  ).slice(0, 4); // Show max 4 related products

  if (relatedProducts.length === 0) {
    $relatedProductsGrid.html('<p>No related products found.</p>');
    return;
  }

  let relatedProductsHTML = relatedProducts.map(product => `
    <a href="product.html?product=${encodeURIComponent(product.name)}" class="related-product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p class="price">$${product.price}</p>
    </a>
  `).join('');

  $relatedProductsGrid.html(relatedProductsHTML);
}

function setupEventListeners(product) {
  let $quantityInput = $('#quantity');
  let $decreaseBtn = $('#decrease-qty');
  let $increaseBtn = $('#increase-qty');

  // Quantity controls
  $decreaseBtn.on('click', function() {
    let currentValue = parseInt($quantityInput.val());
    if (currentValue > 1) {
      $quantityInput.val(currentValue - 1);
    }
  });

  $increaseBtn.on('click', function() {
    let currentValue = parseInt($quantityInput.val());
    if (currentValue < Math.min(10, product.quantity)) {
      $quantityInput.val(currentValue + 1);
    }
  });

  // Add to cart button
  $('#add-to-cart-detail').on('click', function() {
    let quantity = parseInt($quantityInput.val());
    addToCart(product, quantity);
  });

  // Buy now button
  $('#buy-now').on('click', function() {
    let quantity = parseInt($quantityInput.val());
    addToCart(product, quantity);
    window.location.href = '../HTML/checkout.html';
  });
}

function addToCart(product, quantity) {
  let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) return alert("Please login!");

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || [];
  let existing = cart.find(item => item.name === product.name);
  let currentQtyInCart = existing ? existing.quantity : 0;

  if (currentQtyInCart + quantity > product.quantity) {
    return alert(`Sorry, only ${product.quantity} units of "${product.name}" are available.`);
  }

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity: quantity });
  }
  
  allCarts[currentUser.email] = cart;
  localStorage.setItem("allCarts", JSON.stringify(allCarts));
  
  let $addToCartBtn = $('#add-to-cart-detail');
  $addToCartBtn.addClass('added').text('✓ Added to Cart');

  setTimeout(() => {
    $addToCartBtn.removeClass('added').text('Add to Cart');
  }, 2000);

  updateCartCount();
  alert(`${quantity} ${product.name} added to cart`);
}

function updateCartCount() {
  let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  let $cartCount = $("#cart-count");
  
  if (!$cartCount.length) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = (currentUser && currentUser.email) ? allCarts[currentUser.email] || [] : [];
  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  $cartCount.text(totalQty);
  $cartCount.css("display", totalQty > 0 ? "inline-block" : "none");
}