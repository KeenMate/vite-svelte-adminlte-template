Array.from(document.querySelectorAll(".notification button.delete"))
	.forEach(btn => {
		btn.addEventListener("click", function () {
			this.parentElement.remove()
		})
	})
