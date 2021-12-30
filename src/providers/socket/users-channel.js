import {pushSocketMessage} from "./common"
import {Channel} from "./channel"

const usersChannel = new Channel("users:lobby")

export async function getUsers(search) {
	const channel = await usersChannel.get()

	return await pushSocketMessage(channel, "get_users", {search})
}

export async function getUser(userId) {
	const channel = await usersChannel.get()

	return await pushSocketMessage(channel, "get_user", {user_id: userId})
}

export default usersChannel
