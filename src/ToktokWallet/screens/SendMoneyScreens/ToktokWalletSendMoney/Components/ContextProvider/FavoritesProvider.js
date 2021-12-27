import React , {createContext , useReducer} from 'react'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { GET_FAVORITES , POST_FAVORITE , PATCH_REMOVE_FAVORITE } from 'toktokwallet/graphql'
import { useLazyQuery , useMutation } from '@apollo/react-hooks';
import {useAlert} from 'src/hooks/useAlert'
import {onErrorAlert} from 'src/util/ErrorUtility'


export const FavoritesContext = createContext()
const { Provider } = FavoritesContext

const initialData = []

const FavoritesProvider = ({children}) => {

    const alert = useAlert();

    const [state,dispatch] = useReducer((state,action)=>{
        switch(action.type){
          case "GET_FAVORITES":
            return action.payload
          default:
            return state
        }
    },initialData)

    const [patchRemoveFavorite] = useMutation(PATCH_REMOVE_FAVORITE,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({patchRemoveFavorite})=>{
          getFavorites()
        },
        onError: (error)=> onErrorAlert({alert,error})
      })
  
      const [postFavorite]= useMutation(POST_FAVORITE, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({postFavorite})=>{
          getFavorites()
        },
        onError: (error)=> {
          onErrorAlert({alert,error})
        }
      })
  
      const [getFavorites , {loading}] = useLazyQuery(GET_FAVORITES, {
          client: TOKTOK_WALLET_GRAPHQL_CLIENT,
          fetchPolicy:"no-cache",
          onCompleted: ({getFavorites})=>{
            dispatch({
              type: "GET_FAVORITES",
              payload: getFavorites
            })
          },  
          onError: (error)=> {
            onErrorAlert({alert,error})
          }
      })



      const addAccountFavorites = (accountId)=>{
        postFavorite({
          variables: {
            input: {
              favoriteAccountId: accountId
            }
          }
        })
      }
  
      const removeFromList = (account)=>{
        patchRemoveFavorite({
          variables: {
            input: {
              id: account.id
            }
          }
        })
      }
  
    
    return (
        <Provider
          value={{
            addAccountFavorites,
            removeFromList,
            getFavorites,
            favorites: state
          }}
        >
            {children}
        </Provider>
    )
}

export default FavoritesProvider