document.addEventListener("DOMContentLoaded", function () {
  let hamburger = document.getElementById("hamburger");
  let navDesc = document.getElementById('navLinks');    // links container
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navDesc.classList.toggle('open');
    });
  }
});