import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const ToktokMallContext = createContext()
const {Provider} = ToktokMallContext

const ToktokMallContextProvider = ({children}) => {
  
	const session = useSelector(state=>state.session)
	const user = session?.user.person || {}

	const [userData, setUserData] = useState({
		name: `${user.firstName} ${user.lastName}`,
		profileImage: user.avatarThumbnail,
		username: session?.user.username,
		mobileNumber: session?.user.username,
		address: user.address
	})
	const [notifCount, setNotifCount] = useState(0)

	return (
		<Provider
			value={{
				notifCount,
				setNotifCount,
				userData,
				setUserData
			}}
		>
			{children}
		</Provider>
	)
}

export default ToktokMallContextProvider