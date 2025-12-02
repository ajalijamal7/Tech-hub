$(function () {
    let PCParts;
    $.getJSON("../data/products.json")
        .done(function (data) {
            PCParts = data.PCParts;
            initializeProductPage();
        })
        .fail(function (error) {
            console.error("Error loading products:", error);
            let storedProducts = localStorage.getItem("PCParts");
            PCParts = storedProducts ? JSON.parse(storedProducts) : [];
            initializeProductPage();
        });

    function initializeProductPage() {
        let $hamburger = $("#hamburger");
        let $navDesc = $("#navLinks");
        if ($hamburger.length && $navDesc.length) {
            $hamburger.on("click", function () {
                $navDesc.toggleClass("open");
            });
        }

        let urlParams = new URLSearchParams(window.location.search);
        let productName = urlParams.get("product");

        if (!productName) {
            window.location.href = "products.html";
            return;
        }

        let product = PCParts.find(p => p.name === decodeURIComponent(productName));
        if (!product) {
            window.location.href = "products.html";
            return;
        }

        displayProductDetails(product);
        displayRelatedProducts(product, PCParts);
        setupEventListeners(product);
        updateCartCount();
    }

    function displayProductDetails(product) {
        document.title = `${product.name} - TechHub`;
        $("#product-category").text(product.category);
        $("#product-name-breadcrumb").text(product.name);
        $("#product-image").attr({ src: product.image, alt: product.name });
        $("#product-title").text(product.name);
        $("#product-brand").text(product.brand);
        $("#product-category-full").text(product.category);
        $("#product-price").text(`$${product.price}`);

        let $stockElement = $("#product-stock");
        $stockElement.text(`${product.quantity} in stock`).removeClass("low out");
        if (product.quantity < 5) $stockElement.addClass("low");
        if (product.quantity === 0) {
            $stockElement.addClass("out").text("Out of stock");
        }

        $("#product-description").text(product.desc);
        generateFeatureList(product.desc);
    }

    function generateFeatureList(description) {
        let $featureList = $("#feature-list");
        let sentences = description.split(". ").filter(s => s.trim().length > 0);
        $featureList.empty();
        $.each(sentences, function (_, sentence) {
            if (sentence.trim()) {
                $featureList.append(`<li>${sentence}${sentence.endsWith(".") ? "" : "."}</li>`);
            }
        });
    }

    function displayRelatedProducts(currentProduct, allProducts) {
        let $relatedProductsGrid = $("#related-products");
        let relatedProducts = $.grep(allProducts, function (p) {
            return p.category === currentProduct.category && p.name !== currentProduct.name;
        }).slice(0, 4);

        if (relatedProducts.length === 0) {
            $relatedProductsGrid.html("<p>No related products found.</p>");
            return;
        }

        let html = "";
        $.each(relatedProducts, function (_, product) {
            html += `
                <a href="product.html?product=${encodeURIComponent(product.name)}" class="related-product-card">
                    <img src="${product.image}" alt="${product.name}" />
                    <h4>${product.name}</h4>
                    <p class="price">$${product.price}</p>
                </a>
            `;
        });

        $relatedProductsGrid.html(html);
    }

    function setupEventListeners(product) {
        let $quantityInput = $("#quantity");
        $("#decrease-qty").on("click", function () {
            let val = parseInt($quantityInput.val());
            if (val > 1) $quantityInput.val(val - 1);
        });
        $("#increase-qty").on("click", function () {
            let val = parseInt($quantityInput.val());
            if (val < Math.min(10, product.quantity)) $quantityInput.val(val + 1);
        });
        $("#add-to-cart-detail").on("click", function () {
            let qty = parseInt($quantityInput.val());
            addToCart(product, qty);
        });
        $("#buy-now").on("click", function () {
            let qty = parseInt($quantityInput.val());
            addToCart(product, qty);
            window.location.href = "../HTML/checkout.html";
        });
    }

    function addToCart(product, quantity) {
        let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        if (!currentUser) return alert("Please login!");

        let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
        let cart = allCarts[currentUser.email] || [];
        let existing = $.grep(cart, function (item) { return item.name === product.name; })[0];
        let currentQtyInCart = existing ? existing.quantity : 0;

        if (currentQtyInCart + quantity > product.quantity) {
            return alert(`Sorry, only ${product.quantity} units of "${product.name}" are available.`);
        }

        if (existing) existing.quantity += quantity;
        else cart.push($.extend({}, product, { quantity: quantity }));

        allCarts[currentUser.email] = cart;
        localStorage.setItem("allCarts", JSON.stringify(allCarts));

        let $btn = $("#add-to-cart-detail");
        $btn.addClass("added").text("✓ Added to Cart");
        setTimeout(function () {
            $btn.removeClass("added").text("Add to Cart");
        }, 2000);

        updateCartCount();
        alert(`${quantity} ${product.name} added to cart`);
    }

    function updateCartCount() {
        let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        let $cartCount = $("#cart-count");
        if (!$cartCount.length) return;

        let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
        let cart = currentUser && currentUser.email ? allCarts[currentUser.email] || [] : [];
        let totalQty = 0;
        $.each(cart, function (_, item) {
            totalQty += item.quantity;
        });

        $cartCount.text(totalQty);
        $cartCount.css("display", totalQty > 0 ? "inline-block" : "none");
    }
});
