$(function () {

    let PCParts = [];
    let Products_grid = $(".product-grid");
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));


    $.getJSON("../data/products.json")
        .done(function (data) {
            PCParts = data.PCParts;
            localStorage.setItem("PCParts", JSON.stringify(PCParts));
            initializeApp();
        })
        .fail(function (error) {
            console.error("Error loading products:", error);

            let stored = localStorage.getItem("PCParts");
            if (stored) {
                PCParts = JSON.parse(stored);
            }

            initializeApp();
        });


    function initializeApp() {
        initializeEventListeners();
        displayItems(PCParts);
        updateCartCount();
    }


    function initializeEventListeners() {

        let $hamburger = $("#hamburger");
        let $navDesc = $("#navLinks");

        if ($hamburger.length) {
            $hamburger.on("click", function () {
                $navDesc.toggleClass("open");
            });
        }


        let $filterToggle = $(".filter-toggle");
        let $filters = $(".filters");

        if ($filterToggle.length && $filters.length) {
            $filterToggle.on("click", function () {
                $filters.toggleClass("active");
                $filterToggle.text(
                    $filters.hasClass("active") ? "Hide Filters" : "Show Filters"
                );
            });
        }


        $('input[name="brand"], input[name="category"]').on("change", applyFilters);


        initializeSearch();


        initializeCartAnimations();


        $(document).on("click", ".add-to-cart", function () {
            let productName = $(this).data("product-name");
            if (!productName) {
                productName = $(this).attr("onclick")?.match(/'(.+?)'/)?.[1];
            }
            addToCartByName(productName);
        });
    }


    function initializeSearch() {
        let $searchBar = $("#search-bar");
        let $headerSearch = $("#header-search-input");

        function handleSearch(event) {
            let query = $(event.target).val().toUpperCase();
            let results = PCParts.filter(part =>
                query === "" || part.name.toUpperCase().includes(query)
            );
            displayItems(results);
        }

        if ($searchBar.length) {
            $searchBar.on("input", handleSearch);
        }

        if ($headerSearch.length) {
            $headerSearch.on("input", handleSearch);
        }
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


    function displayItems(itemsArray) {
        if (!Products_grid.length) return;

        let html = itemsArray
            .map(part => `
                <article class="product-card">
                    <a href="product.html?product=${encodeURIComponent(part.name)}" class="product-link">
                        <img src="${part.image}" loading="lazy" alt="${part.name}">
                        <h3>${part.name}</h3>
                    </a>
                    <p class="price">$${part.price}</p>
                    <button class="add-to-cart" data-product-name="${part.name}">
                        Add to Cart
                    </button>
                </article>
            `)
            .join("");

        Products_grid.html(html);
    }


    function getSelectedFilters() {
        return {
            brand: ($('input[name="brand"]:checked').val() || "ALL").toUpperCase(),
            category: ($('input[name="category"]:checked').val() || "ALL").toUpperCase()
        };
    }


    function applyFilters() {
        let { brand, category } = getSelectedFilters();

        let filtered = PCParts.filter(part => {
            let matchBrand = brand === "ALL" || part.brand.toUpperCase() === brand;
            let matchCategory = category === "ALL" || part.category.toUpperCase() === category;
            return matchBrand && matchCategory;
        });

        displayItems(filtered);
    }


    function updateCartCount() {
        let $cartCount = $("#cart-count");
        if (!$cartCount.length) return;

        let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
        let cart = currentUser?.email ? (allCarts[currentUser.email] || []) : [];
        let total = cart.reduce((sum, item) => sum + item.quantity, 0);

        $cartCount.text(total);
        $cartCount.css("display", total > 0 ? "inline-block" : "none");
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
        let qty = existing ? existing.quantity : 0;

        if (qty + 1 > product.quantity) {
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
