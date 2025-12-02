$(function () {

    let PCParts = [];
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    
    $.getJSON("data/products.json")
        .done(function (data) {
            PCParts = data.PCParts;
            localStorage.setItem("PCParts", JSON.stringify(PCParts));
            initializeHomePage();
        })
        .fail(function (error) {
            console.error("Error loading products:", error);

            let stored = localStorage.getItem("PCParts");
            if (stored) {
                PCParts = JSON.parse(stored);
            }

            initializeHomePage();
        });


    function initializeHomePage() {
        initializeEventListeners();
        displayFeaturedProducts();
        updateCartCount();
    }


    function initializeEventListeners() {
        let $hamburger = $("#hamburger");
        let $navDesc = $('#navLinks');

        if ($hamburger.length) {
            $hamburger.on("click", function () {
                $navDesc.toggleClass("open");
            });
        }

        initializeCartAnimations();

        $(document).on("click", ".add-to-cart", function () {
            let productName = $(this).data("product-name");
            addToCartByName(productName);
        });
    }


    function initializeCartAnimations() {
        $("body").on("click", ".add-to-cart", function () {

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

        let cards = featuredProducts.map(part => `
            <article class="product-card">
                <a href="HTML/product.html?product=${encodeURIComponent(part.name)}" class="product-link">
                    <img src="${"HTML/" + part.image}" alt="${part.name}" />
                    <h3>${part.name}</h3>
                </a>
                <p class="price">$${part.price}</p>
                <button class="add-to-cart" data-product-name="${part.name}">
                    Add to Cart
                </button>
            </article>
        `).join("");

        $featuredGrid.html(cards);
    }


    function updateCartCount() {
        let $cartCount = $("#cart-count");
        if (!$cartCount.length) return;

        let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};

        let cart = currentUser && currentUser.email
            ? allCarts[currentUser.email] || []
            : [];

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
        let qtyInCart = existing ? existing.quantity : 0;

        if (qtyInCart + 1 > product.quantity) {
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

});
