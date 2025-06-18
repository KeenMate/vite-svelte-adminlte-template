class SortableTable {
	defaultIconClasses     = "fas fa-fw"
	defaultAscendingClass  = "fa-sort-up"
	defaultDescendingClass = "fa-sort-down"
	defaultIconPosition    = "after"
	defaultSortedClass     = "sorted"

	headerIconsMap = {}

	get iconClasses() {
		return this.options.iconClasses || this.defaultIconClasses
	}

	get ascendingClass() {
		return this.options.ascendingClass || this.defaultAscendingClass
	}

	get descendingClass() {
		return this.options.descendingClass || this.defaultDescendingClass
	}

	get iconPosition() {
		const position = this.options.descendingClass || this.defaultIconPosition

		if (position === "before") {
			return "afterbegin"
		} else {
			return "beforeend"
		}
	}

	get sortedClass() {
		return this.options.sortedClass || this.defaultSortedClass
	}


	constructor(element, options) {
		this.tableElement = element
		this.options      = options

		this.isDivTable = this.tableElement.tagName === "DIV"

		this.sortedHeader  = this.options?.header || null
		this.sortDirection = this.options?.direction || null
	}

	init() {
		this.tableElement.classList.add("sortable")

		const headerEventUnsubscribes = this.setupHeaders()

		this.clearHTML()
		this.updateHTML()

		const instance = this

		return {
			update(options) {
				instance.sortedHeader  = options.header
				instance.sortDirection = options.direction

				instance.updateHTML()
			},
			destroy() {
				headerEventUnsubscribes.forEach(x => x())

				instance.tableElement?.classList.remove("sortable")
			}
		}
	}

	clearHTML() {
		const headerElements = this.getTableHeaderElements()

		headerElements.forEach(el => {
			el.classList.remove(this.sortedClass)
			el.classList.remove(this.ascendingClass)
			el.classList.remove(this.descendingClass)
		})
	}

	updateHTML() {
		const headerElements = this.getTableHeaderElements()

		window.requestAnimationFrame(() => {
			headerElements.forEach(el => {
				const sortKey = this.getHeaderSortKey(el)

				this.headerIconsMap[sortKey].classList.remove(this.ascendingClass)
				this.headerIconsMap[sortKey].classList.remove(this.descendingClass)
				if (sortKey === this.sortedHeader) {
					el.classList.add(this.sortedClass)
					this.headerIconsMap[sortKey].classList.add(this.getSortDirectionClass(this.sortDirection))
					// el.classList.add(this.getSortDirectionClass(this.sortDirection))
				} else {
					el.classList.remove(this.sortedClass)
				}
			})
		})
	}

	getHeaderSortKey(el) {
		return el.dataset.sortKey
	}

	setupHeaders() {
		const headerElements    = this.getTableHeaderElements()
		const eventUnsubscribes = []

		headerElements
			.map(el => {
				this.insertIconPlaceholder(el)

				const handler = this.onHeaderClick.bind(this)
				el.addEventListener("click", handler)
				eventUnsubscribes.push(() => {
					el.removeEventListener("click", handler)
				})
			})

		return eventUnsubscribes
	}

	insertIconPlaceholder(el) {
		const headerSortKey = this.getHeaderSortKey(el)

		// Should not be possible (but just in case)
		if (this.headerIconsMap[headerSortKey]) {
			this.headerIconsMap[headerSortKey].remove()
			delete this.headerIconsMap[headerSortKey]
		}

		const icon = document.createElement("i")
		this.iconClasses.split(" ").forEach(x => icon.classList.add(x))

		el.insertAdjacentElement(this.iconPosition, icon)
		this.headerIconsMap[headerSortKey] = icon
	}

	getTableHeaderElements() {
		const headersSelector = this.getHeadersSelector(this.isDivTable)
		return Array.from(this.tableElement.querySelectorAll(headersSelector))
			.filter(el => {
				const sortKey = this.getHeaderSortKey(el)
				if (sortKey === undefined) {
					if (el.dataset.noSort === undefined) {
						console.warn(
							"Sortable table header element has no \"data-sort-key\" attribute.\nIf sorting is not desired for this column, add \"data-no-sort\" instead",
							el
						)
					}

					return false
				}

				return sortKey !== ""
			})
	}

	onHeaderClick(ev) {
		const key = this.getHeaderSortKey(ev.target)

		let newHeader    = key
		let newDirection = this.sortedHeader === key
			? (this.sortDirection === "asc" ? "desc" : "asc")
			: "asc"

		this.emitSortEvent(newHeader, newDirection)
	}

	emitSortEvent(header, direction) {
		const event = new CustomEvent("sorttable", {
			detail: {
				header,
				direction
			}
		})

		this.tableElement.dispatchEvent(event)
	}

	getSortDirectionClass(direction) {
		return direction === "asc"
			? this.ascendingClass
			: this.descendingClass
	}

	getHeadersSelector(isDivTable) {
		return isDivTable
			? ".thead > .tr > .th"
			: "thead > tr > th"
	}
}

export default function (element, options) {
	const instance = new SortableTable(element, options)

	return instance.init()
}

