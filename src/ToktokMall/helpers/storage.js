import AsyncStorage from "@react-native-community/async-storage";

export const ASAddToCart = async (userId, data, callback) => {
	let loc = `@toktokmallcart-${userId}`
	let raw = await AsyncStorage.getItem(loc)
	let content = typeof raw == "string" ? JSON.parse(raw) : []
	content.push(data)
	await AsyncStorage.setItem(loc, JSON.stringify(content)).then(() => {
		callback()
	})
}

export const ASGetCart = async (userId, callback) => {
	let loc = `@toktokmallcart-${userId}`
	let raw = await AsyncStorage.getItem(loc)
	let content = typeof raw == "string" ? JSON.parse(raw) : []
	callback(content)
}

export const ASCountCart = async (userId, callback) => {
	let loc = `@toktokmallcart-${userId}`
	let raw = await AsyncStorage.getItem(loc)
	let content = typeof raw == "string" ? JSON.parse(raw) : []
	callback(content.length)
}