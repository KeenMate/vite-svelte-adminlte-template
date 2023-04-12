const navbarToggler = document.getElementById("navbar-toggle")
const navbar = document.getElementById("navbar")

navbarToggler.addEventListener("click", function () {
	this.classList.toggle("is-active")
	navbar.classList.toggle("is-active")
})