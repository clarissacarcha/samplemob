import AsyncStorage from "@react-native-community/async-storage";

export const ASAddToCart = async (userId, data, callback) => {
	let loc = `@toktokmallcart-${userId}`
	let raw = await AsyncStorage.getItem(loc)
	let content = typeof raw == "string" ? JSON.parse(raw) : []
	// let storeData = content.filter((a, b) => a.store == data.shop.shopname)
	// let cart = storeData.cart
	// content.push(data)

	let temp = []
	let found = false

	for(var x=0;x<content.length;x++){
		let storeData = content[x]
		if(storeData.store.id == data.shop.id){
			storeData.cart.push(data)
			found = true
			temp.push(storeData)
		}else{
			temp.push(content[x])
		}
	}

	if(!found){
		temp.push({
			store: data.shop,
			cart: [data]
		})
	}

	await AsyncStorage.setItem(loc, JSON.stringify(temp)).then(() => {
		callback()
	})
}

export const ASGetCart = async (userId, callback) => {
	let loc = `@toktokmallcart-${userId}`
	let raw = await AsyncStorage.getItem(loc)
	let content = typeof raw == "string" ? JSON.parse(raw) : []
	callback(content)
}

export const ASClearCart = async (userId, callback) => {
	let loc = `@toktokmallcart-${userId}`
	await AsyncStorage.removeItem(loc)
}

export const ASCountCart = async (userId, callback) => {
	let loc = `@toktokmallcart-${userId}`
	let raw = await AsyncStorage.getItem(loc)
	let content = typeof raw == "string" ? JSON.parse(raw) : []
	callback(content.length)
}

export const ASRemoveCart = async (userId, data, callback) => {
	let loc = `@toktokmallcart-${userId}`
	let raw = await AsyncStorage.setItem(loc, JSON.stringify(data)).then(() => {
		callback()
	})
}


//SEARCH HISTORY
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

//SEARCH HISTORY
export const ASClearSearchHistory = async (userId, callback) => {
	let loc = `@toktokmallsearchhistory-${userId}`
	await AsyncStorage.setItem(loc, JSON.stringify([])).then(() => {
		callback("success", {})
	}).catch((err) => callback("error", err))
}