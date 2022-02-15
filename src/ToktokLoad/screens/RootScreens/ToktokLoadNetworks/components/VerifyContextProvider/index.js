import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

  const [favorites, setFavorites] = useState([]);
  const [loads, setLoads] = useState({});
  const [selectedLoad, setSelectedLoad] = useState({});
  
  return (
    <Provider
      value={{
        favorites,
        setFavorites,
        loads,
        setLoads,
        selectedLoad,
        setSelectedLoad,
      }}
    >
      {children}
    </Provider>
  )
}
