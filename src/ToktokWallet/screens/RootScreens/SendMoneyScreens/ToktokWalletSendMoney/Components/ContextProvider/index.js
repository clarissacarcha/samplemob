import React , {createContext , useState} from 'react'
export * from "./FavoritesProvider";
// SELF IMPORTS
import FavoritesProvider from './FavoritesProvider'

export const SendMoneyContext = createContext()
const { Provider } = SendMoneyContext

export const ContextProvider = ({children}) => {

    return (
        <Provider>
            <FavoritesProvider>
                 {children}
            </FavoritesProvider>
        </Provider>
    )
}