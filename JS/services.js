$(function () {
    document.addEventListener("DOMContentLoaded", function () {
        let $hamburger = $("#hamburger");
        let $navLinks = $("#navLinks");

        if ($hamburger.length && $navLinks.length) {
            $hamburger.on("click", function () {
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
    renderOptions()

    function renderOptions() {
        CPUS.forEach((CPU) => {
            $("#options-cpu").append(
                `<div class="option">
                  <img src="${CPU.image}" alt="CPU Image"  loading="lazy">
                  <div class="info">
                    <p class="name">${CPU.name}</p>
                    <span>${CPU.price}$</span>
                  </div>
                </div>`)
        })

        GPUS.forEach((GPU) => {
            $("#options-gpu").append(`<div class="option">
                  <img src="${GPU.image}" alt="CPU Image"  loading="lazy">
                  <div class="info">
                    <p class="name">${GPU.name}</p>
                    <span>${GPU.price}$</span>
                  </div>
                </div>`)
        })

        Motherboards.forEach((Motherboard) => {
            $("#options-motherboard").append(`
            <div div class= "option" >
            <img src="${Motherboard.image}" alt="CPU Image"  loading="lazy">
                <div class="info">
                    <p class="name">${Motherboard.name}</p>
                    <span>${Motherboard.price}$</span>
                </div>
            </div>`)
        })

        RAMS.forEach((RAM) => {
            $("#options-ram").append(
                ` <div div class= "option" >
            <img src="${RAM.image}" alt="CPU Image"  loading="lazy">
                <div class="info">
                    <p class="name">${RAM.name}</p>
                    <span>${RAM.price}$</span>
                </div>
            </div>`)
        })

        Storages.forEach((Storage) => {
            $("#options-storage").append(` <div div class= "option" >
            <img src="${Storage.image}" alt="CPU Image"  loading="lazy">
                <div class="info">
                    <p class="name">${Storage.name}</p>
                    <span>${Storage.price}$</span>
                </div>
            </div>`)
        })
    }

    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
    updateCartCount()

    $(".selected").on("click", function () {
        $(".options").not($(this).siblings(".options")).slideUp(200)
        $(this).siblings(".options").slideToggle(200)
    })


    let selectedCPU
    let selectedGPU
    let selectedMotherboard
    let selectedRAM
    let selectedStorage
    let pc = []

    $(".option").on("click", function () {
        $(this).closest(".options").slideUp(200)
        let category = $(this).closest(".options").data("part")
        let selectedItemName = $(this).find(".name").text()
        console.log(category)


        if (category === "cpu") {
            selectedCPU = selectedItemName;
        } else if (category === "gpu") {
            selectedGPU = selectedItemName;
        } else if (category === "motherboard") {
            selectedMotherboard = selectedItemName;
        } else if (category === "ram") {
            selectedRAM = selectedItemName;
        } else if (category === "storage") {
            selectedStorage = selectedItemName;
        }

        $("#select-cpu").text(selectedCPU)
        $("#select-gpu").text(selectedGPU)
        $("#select-motherboard").text(selectedMotherboard)
        $("#select-ram").text(selectedRAM)
        $("#select-storage").text(selectedStorage)







        pc = []
        if (selectedCPU) pc.push(selectedCPU);
        if (selectedGPU) pc.push(selectedGPU);
        if (selectedMotherboard) pc.push(selectedMotherboard);
        if (selectedRAM) pc.push(selectedRAM);
        if (selectedStorage) pc.push(selectedStorage);
        console.log(pc)
        renderPcParts(pc)
    })



    function renderPcParts(chosenParts) {
        let totalPrice = 0
        $("#mini-checkout-list").empty()
        $.each(chosenParts, (_, part) => {
            let chosenPart = PCParts.find(p => p.name == part)
            totalPrice += chosenPart.price

            $("#mini-checkout-list").append($(`
            <li class="part">
                <div class="part-info">
                    <img src="${chosenPart.image}" alt="part-image">
                    <p>${chosenPart.name}</p>
                </div>
                <span>Price: $${chosenPart.price}</span>
            </li>
        `)
            )
        })

        $("#mini-total-price").text(totalPrice)


    }

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

    function orderParts(parts) {
        $.each(parts, (_, part) => {
            addToCartByName(part)

        })
    }

    $("#order-parts").on("click", () => {
        if (currentUser) {
            orderParts(pc)
            $("#mini-checkout-list").empty()
            alert(`${pc} added to cart`);
        }
        else{
            alert ("Please login!")
        }

    })

    $("#order-pc").on("click", () => {

    })


})
