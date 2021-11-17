import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const CartContext = createContext()
const {Provider} = CartContext

export const CartContextProvider = ({children})=> {

	const [selectAll, setSelectAll] = useState(false)

	return (
		<Provider 
			value={{
				selectAll,
				setSelectAll				
			}}
		>
			{children}
		</Provider>
	)
	
}