import React, { useEffect , useState } from 'react'
import {View,Text,StyleSheet,Platform,Alert,TextInput,FlatList,ActivityIndicator,Image} from 'react-native'
import {check,request,PERMISSIONS,RESULTS} from 'react-native-permissions'
import Contacts from 'react-native-contacts';
import {sortBy} from 'lodash'
import {COLOR,FONT_REGULAR} from '../../../../../../res/constants'
import {HeaderBack, HeaderTitle} from '../../../../../../components'
import ContactInfoRender from './ContactInfoRender'
import SendtoOthers from './SendtoOthers'
import MessageModal from './MessageModal'
import {useLazyQuery} from '@apollo/react-hooks'
import {CHECK_USER_ACCOUNT,CLIENT} from '../../../../../../graphql'
import {useSelector} from 'react-redux'

const SendWalletComponent = ({navigation,route})=> {

    navigation.setOptions({
      // headerLeft: ()=> <HeaderBack />,
      headerTitle: ()=> <HeaderTitle label={['Choose a Recipient']} />,
    })

    const [data, setData] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    const [filteredData, setFilteredData] = useState(null);
    const [searchString,setSearchString] = useState("");
    const [sendToOther,setSendToOther] = useState(false)
    const [msgModalVisible,setMsgModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const session = useSelector(state=>state.session)

    const goToContacts = async ()=> {
        const checkAndRequest = Platform.select({
            android: async () => {
              const checkResult = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
      
              if (checkResult === RESULTS.GRANTED) {
                return true;
              }
      
              if (checkResult === RESULTS.BLOCKED) {
                Alert.alert(
                  '',
                  "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
                );
                return false;
              }
      
              if (checkResult === RESULTS.UNAVAILABLE) {
                Alert.alert('', 'Access to contacts is unavailable.');
                return false;
              }
      
              if (checkResult === RESULTS.DENIED) {
                const requestResult = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      
                if (requestResult === RESULTS.GRANTED) {
                  return true;
                }
      
                if (requestResult === RESULTS.BLOCKED) {
                  Alert.alert(
                    '',
                    "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
                  );
                  return false;
                }
      
                if (requestResult === RESULTS.DENIED) {
                  Alert.alert('', "Sorry, we can't access your contacts without sufficient permission.");
                  return false;
                }
              }
            },
            ios: async () => {
              const checkResult = await check(PERMISSIONS.IOS.CONTACTS);
      
              if (checkResult === RESULTS.GRANTED) {
                return true;
              }
      
              if (checkResult === RESULTS.BLOCKED) {
                Alert.alert(
                  '',
                  "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
                );
                return false;
              }
      
              if (checkResult === RESULTS.UNAVAILABLE) {
                Alert.alert('', 'Access to contacts is unavailable.');
                return false;
              }
      
              if (checkResult === RESULTS.DENIED) {
                const requestResult = await request(PERMISSIONS.IOS.CONTACTS);
                if (requestResult === RESULTS.GRANTED) {
                  return true;
                }
      
                if (requestResult === RESULTS.BLOCKED) {
                  Alert.alert(
                    '',
                    "Contacts access have been blocked. Please allow toktok to access your contacts in your phone's settings.",
                  );
                  return false;
                }
              }
            },
          });
      
          const result = await checkAndRequest();
          if(result) getContacts()
    }

    const getContacts = async ()=>{
        try {
            Contacts.getAllWithoutPhotos((error, contacts) => {
              if (error) {
                setFetchError(true);
              }
      
              // console.log(JSON.stringify(contacts, null, 4));
      
              const mappedContacts = contacts
                .filter((contact) => {
                  if (Platform.OS === 'android') {
                    if (contact.phoneNumbers.length === 0 || !contact.displayName) {
                      return false;
                    }
                    return true;
                  }
      
                  if (Platform.OS === 'ios') {
                    if (contact.phoneNumbers.length === 0 || !contact.givenName) {
                      return false;
                    }
                    return true;
                  }
                })
                .map((contact) => {
                  return {
                    name: `${contact.givenName} ${contact.familyName}`,
                    number: contact.phoneNumbers[0].number,
                  };
                });
      
              const sortedContacts = sortBy(mappedContacts, (contact) => contact.name);
      
              setData(sortedContacts);
              setFilteredData(sortedContacts);
            });
          } catch (error) {
            console.log(error);
          }
    }

    const filterSearch = (value)=> {
        setSearchString(value)
        const filteredContacts = data.filter((contact) => {
          return contact.name.toLowerCase().includes(value.toLowerCase()) || contact.number.toLowerCase().includes(value.toLowerCase())
        });
        setFilteredData(filteredContacts);
        if(filteredContacts.length == 0){
          setSendToOther(true)
        }else{
          setSendToOther(false)
        }
    }


    const [checkUserAccount, {data: userInfo, error, loading}] = useLazyQuery(CHECK_USER_ACCOUNT, {
        fetchPolicy: 'network-only',
        onError: (err) => {
          
          if(err.networkError && err.networkError.result.errors[0].code == "GRAPHQL_VALIDATION_FAILED"){
              Alert.alert("Invalid Mobile Number Format")
          }

          if(err.graphQLErrors.length > 0){
            err.graphQLErrors.map((error)=> {
                setModalMessage(error.message)
                setMsgModalVisible(true)
            })
          }

        },
        onCompleted: (response) => {
          if(response.checkUserAccount.username === session.user.username){
            Alert.alert("You cannot send money to yourself!")
          }else{
            navigation.navigate("TokTokWalletActionsSendConfirmPayment", {recipientInfo: response.checkUserAccount , walletinfo: route.params.walletinfo})
          }
        },
    })

    const checkAccount = async (mobileNo)=> {
      const trimmedMobile = mobileNo.replace(/[. ]/gi,"")
      checkUserAccount({
        variables: {
          input: {
            mobileNo: trimmedMobile
          }
        },
      })
    }


    useEffect(()=>{
        goToContacts()
    },[])

    if (!filteredData) {
        return (
          <View style={styles.center}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
      }
    
      if (fetchError) {
        return (
          <View style={styles.center}>
            <Text>Sorry, we cannot obtain your contacts' information.</Text>
          </View>
        );
      }

    return (
      <><MessageModal msgModalVisible={msgModalVisible} setMsgModalVisible={setMsgModalVisible} modalMessage={modalMessage}/>
       <View style={styles.container}>
           <View style={styles.searchField}>
                <View style={[styles.input,{flexDirection: "row"}]}>
                    <Image style={{height: 25,width: 40,alignSelf: "center"}} resizeMode="center" source={require('../../../../../../assets/icons/ph.png')}/>
                    <TextInput 
                        style={{fontSize: 12,fontFamily: FONT_REGULAR,padding: 0,marginLeft: 5,alignSelf: "center",flex: 1}}
                        placeholder="Enter a Name or mobile number"
                        onChangeText={filterSearch}
                        value={searchString}
                    />
                </View>
           </View>

           <View style={styles.contactlist}>
               {
                 !sendToOther
                 ?  <FlatList
                          showsVerticalScrollIndicator={false}
                          data={filteredData}
                          keyExtractor={(item)=>item.number}
                          style={{flex: 1}}
                          renderItem={({item,index})=>{
                            return <ContactInfoRender item={item} index={index} setSearchString={setSearchString} checkAccount={checkAccount}/>
                          }}
                      />
                  : <SendtoOthers searchString={searchString} checkAccount={checkAccount} />
               }

           </View>
       </View>
      </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    searchField: {
        borderBottomColor: "silver",
        borderBottomWidth: 0.5,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    contactlist: {
        flex: 1,
        padding: 20,
    },
    input: {
      padding: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "silver",
      fontFamily: FONT_REGULAR
    },
})

export default SendWalletComponent