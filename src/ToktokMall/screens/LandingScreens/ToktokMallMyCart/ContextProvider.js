import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const CartContext = createContext()
const {Provider} = CartContext

export const CartContextProvider = ({children})=> {

	const [selectAll, setSelectAll] = useState(false)
	const [swipeRefIndex, setSwipeRefIndex] = useState(0)
	const [selectedFrom, setSelectedFrom] = useState('')
	const [willDelete, setWillDelete] = useState(false)
	const [itemQuantity, setItemQuantity] = useState([])

	return (
		<Provider 
			value={{
				selectAll,
				setSelectAll,
				swipeRefIndex,
				setSwipeRefIndex,
				selectedFrom,
				setSelectedFrom,
				willDelete,
				setWillDelete,
				itemQuantity,
				setItemQuantity
			}}
		>
			{children}
		</Provider>
	)
	
}