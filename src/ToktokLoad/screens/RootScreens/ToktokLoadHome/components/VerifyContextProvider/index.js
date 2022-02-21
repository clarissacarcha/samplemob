import React, {createContext,useState} from 'react'
import {useSelector} from 'react-redux'

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

  const { user } = useSelector((state) => state.session);
  const formattedMobile = user?.username.replace("+63", "0");

  const [activeTab, setActiveTab] = useState(1);
  const [mobileErrorMessage, setMobileErrorMessage] = useState("");
  const [mobileNumber, setMobileNumber] = useState(formattedMobile);
  const [subContainerStyle, setSubContainerStyle] = useState({});
  const tabList = [
    { id: 1, name: "Buy Load" },
    { id: 2, name: "Favorites"}
  ];

  return (
    <Provider
      value={{
        activeTab,
        setActiveTab,
        mobileErrorMessage,
        setMobileErrorMessage,
        mobileNumber,
        setMobileNumber,
        subContainerStyle,
        setSubContainerStyle,
        tabList
      }}
    >
      {children}
    </Provider>
  )
}
