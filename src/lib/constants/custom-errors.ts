export class CancelledError extends Error {
	constructor() {
		super("Operation has been cancelled")
	}
}
