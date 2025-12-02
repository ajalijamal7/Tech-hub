$(function () {
    document.addEventListener("DOMContentLoaded", function () {
        let $hamburger = $("#hamburger");
        let $navLinks = $("#navLinks");
        
        if ($hamburger.length && $navLinks.length) {
            $hamburger.on("click", function() {
                $navLinks.toggleClass("open");
            });
        }
    });

    let PCParts = JSON.parse(localStorage.getItem("PCParts"))
    let CPUS = PCParts.filter(part => part.category == "CPU")
    let GPUS = PCParts.filter(part => part.category == "GPU")
    let Motherboards = PCParts.filter(part => part.category == "Motherboard")
    let RAMS = PCParts.filter(part => part.category == "RAM")
    let Storages = PCParts.filter(part => part.category == "Storage")

    CPUS.forEach((CPU) => {
        $("#cpu").append(` <option value="${CPU.name}">${CPU.name}</option>`)
    })

    GPUS.forEach((GPU) => {
        $("#gpu").append(` <option value="${GPU.name}">${GPU.name}</option>`)
    })

    Motherboards.forEach((Motherboard) => {
        $("#motherboard").append(` <option value="${Motherboard.name}">${Motherboard.name}</option>`)
    })

    RAMS.forEach((RAM) => {
        $("#ram").append(` <option value="${RAM.name}">${RAM.name}</option>`)
    })

    Storages.forEach((Storage) => {
        $("#storage").append(` <option value="${Storage.name}">${Storage.name}</option>`)
    })

    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

    updateCartCount()

    $("#btn-order").on("click", () => {
        let pc = []
        let selectedCPU = $("#cpu").val()
        let selectedGPU = $("#gpu").val()
        let selectedMotherboard = $("#motherboard").val()
        let selectedRAM = $("#ram").val()
        let selectedStorage = $("#storage").val()

        if (selectedCPU) pc.push(selectedCPU);
        if (selectedGPU) pc.push(selectedGPU);
        if (selectedMotherboard) pc.push(selectedMotherboard);
        if (selectedRAM) pc.push(selectedRAM);
        if (selectedStorage) pc.push(selectedStorage);
        if (!currentUser) return alert("Please login!")
        else {
            pc.forEach((part) => {
                addToCartByName(part)
            })
            alert(`${pc} added to cart`);
        }
    })

    function addToCartByName(productName) {
        if (!currentUser) return;
        let product = PCParts.find(p => p.name === productName);
        if (!product) return;

        let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
        let cart = allCarts[currentUser.email] || []

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
        allCarts[currentUser.email] = cart
        localStorage.setItem("allCarts", JSON.stringify(allCarts));

        updateCartCount();
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
})
