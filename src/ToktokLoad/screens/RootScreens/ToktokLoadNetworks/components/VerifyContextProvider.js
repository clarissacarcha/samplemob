import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

  const [selectedLoad, setSelectedLoad] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loads, setLoads] = useState([]);
  
  return (
    <Provider
      value={{
        selectedLoad,
        setSelectedLoad,
        favorites,
        setFavorites,
        loads,
        setLoads
      }}
    >
        {children}
    </Provider>
  )
}
