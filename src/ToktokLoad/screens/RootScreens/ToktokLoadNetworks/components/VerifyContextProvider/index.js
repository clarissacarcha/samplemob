import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

  const [favorites, setFavorites] = useState([]);
  const [hasSearch, setHasSearch] = useState(false);
  const [loads, setLoads] = useState([]);
  const [loadFavorite, setLoadFavorite] = useState(null);
  const [selectedLoad, setSelectedLoad] = useState({});
  const [subContainerStyle, setSubContainerStyle] = useState({});
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(null);

  return (
    <Provider
      value={{
        favorites,
        setFavorites,
        hasSearch,
        setHasSearch,
        loads,
        setLoads,
        loadFavorite,
        setLoadFavorite,
        selectedLoad,
        setSelectedLoad,
        subContainerStyle,
        setSubContainerStyle,
        searchData,
        setSearchData,
        search,
        setSearch,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </Provider>
  )
}
