import AsyncStorage from "@react-native-community/async-storage";

/* SEARCH HISTORY */
export const ASGetSearchHistory = async (userId, callback) => {
	let loc = `@toktokmallsearchhistory-${userId}`
	let raw = await AsyncStorage.getItem(loc)
	let content = typeof raw == "string" ? JSON.parse(raw) : []
	callback(content)
	console.log("content", content)
}

export const ASAddSearchHistory = async (userId, data, callback) => {
	let loc = `@toktokmallsearchhistory-${userId}`
	await ASGetSearchHistory(userId, (raw) => {
		raw.push(data)
		console.log("raw", raw)
		AsyncStorage.setItem(loc, JSON.stringify(raw)).then(() => {
			callback("success", raw)
		}).catch((err) => callback("err", err))
	})
}

export const ASClearSearchHistory = async (userId, callback) => {
	let loc = `@toktokmallsearchhistory-${userId}`
	await AsyncStorage.setItem(loc, JSON.stringify([])).then(() => {
		callback("success", {})
	}).catch((err) => callback("error", err))
}
/* SEARCH HISTORY END */

/* FAVORITES */
export const ASGetFavorites = async (userId, callback) => {
	let loc = `@toktokmallfavorites-${userId}`
	let raw = await AsyncStorage.getItem(loc)
	let content = typeof raw == "string" ? JSON.parse(raw) : []
	callback(content)
	console.log("content", content)
}

export const ASAddFavorites = async (userId, data, callback) => {
	let loc = `@toktokmallfavorites-${userId}`
	await ASGetFavorites(userId, (raw) => {
		raw.push(data)
		console.log("raw", raw)
		AsyncStorage.setItem(loc, JSON.stringify(raw)).then(() => {
			callback("success", raw)
		}).catch((err) => callback("err", err))
	})
}