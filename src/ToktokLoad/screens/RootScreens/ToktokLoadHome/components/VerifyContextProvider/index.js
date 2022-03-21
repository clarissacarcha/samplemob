import React, {createContext,useState,useEffect} from 'react'
import {useSelector} from 'react-redux'
import { TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_ADVERTISEMENTS } from 'toktokload/graphql';
import { useLazyQuery } from '@apollo/react-hooks'
import { usePrompt } from 'src/hooks'
import { ErrorUtility } from 'toktokload/util';

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children, navigation})=> {

  const { user } = useSelector((state) => state.session);
  const formattedMobile = user?.username.replace("+63", "0");

  const [activeTab, setActiveTab] = useState(1);
  const [mobileErrorMessage, setMobileErrorMessage] = useState("");
  const [mobileNumber, setMobileNumber] = useState(formattedMobile);
  const [adHighlight,setAdHighlight] = useState([]);
  const [adsRegular,setAdsRegular] = useState([]);
  const [adsActions, setAdsAction] = useState({ loading: false, error: {} });
  const [refreshing, setRefreshing] = useState(false);
  const prompt = usePrompt();

  const [getAdvertisements, { loading, error }] = useLazyQuery(GET_ADVERTISEMENTS, {
    fetchPolicy:"network-only",
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onCompleted: ({getAdvertisements})=> {
      let adHighlight = [];
      let adsRegular = [];

      getAdvertisements.map((ad)=> {
          if(ad.type == 1) adHighlight.push(ad)
          if(ad.type == 2) adsRegular.push(ad)
      })

      setAdHighlight(adHighlight);
      setAdsRegular(adsRegular);
      setRefreshing(false);
    },
    onError: (error)=> {
      setRefreshing(false);
      // ErrorUtility.StandardErrorHandling({
      //   error,
      //   navigation,
      //   prompt,
      // });
    }
  })

  useEffect(()=> {
    setAdsAction({ loading, error });
  },[loading, error])

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
        tabList,
        adHighlight,
        adsRegular,
        adsActions,
        getAdvertisements,
        refreshing,
        setRefreshing
      }}
    >
      {children}
    </Provider>
  )
}
