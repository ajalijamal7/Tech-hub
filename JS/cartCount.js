document.addEventListener("DOMContentLoaded", () => {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

    updateCartCount()

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
