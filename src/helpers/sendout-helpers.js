/**
 * Returns count of users that share given state
 * @param state {Array} List of grouped states
 * @param stateCode {string} State key to look for
 * @returns {number | 0}
 */
export function getSendoutProgressCount(state, stateCode) {
	return state.find(x => x.state_code === stateCode)?.user_count || 0
}

/**
 * Returns total count of all grouped states
 * @param state {Object}
 * @returns {number}
 */
export function getSumOfSendoutStateItems(state) {
	return state.reduce((acc, x) => acc + x.user_count || 0, 0)
}

export function getSendoutStateValue(state, stateCode) {
	return state.find(x => x.state_code === stateCode)?.state_value
}
