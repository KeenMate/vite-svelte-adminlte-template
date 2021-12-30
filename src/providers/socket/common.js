export function pushSocketMessage(channel, type, payload = {}) {
	return new Promise((resolve, reject) => {
		channel.push(type, payload)
			.receive("ok", ctx => {
				console.log(`Got success response from ${channel.topic} for "${type}" message`, ctx)
				resolve(ctx)
			})
			.receive("error", ctx => {
				console.log(`Got error response from ${channel.topic} for "${type}" message`, ctx)
				reject(ctx)
			})
	})
}
