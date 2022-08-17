import AsyncStorage from "@react-native-community/async-storage"

const destroy = async () => {
	console.log("destroying toktokmall session")
	AsyncStorage.removeItem("ToktokMallUser")
	AsyncStorage.removeItem("ToktokMallMyCart")
	AsyncStorage.removeItem("ToktokMallUserDefaultAddress")
	AsyncStorage.removeItem("ToktokMallNotifications")
	AsyncStorage.removeItem("ToktokMallSearchHistory")
	AsyncStorage.removeItem("ToktokMallUserCartCount")
}

export const ToktokMallSession = {
	destroy: destroy
}
