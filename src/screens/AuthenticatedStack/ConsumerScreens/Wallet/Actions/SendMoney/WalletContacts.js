import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Platform,FlatList,ActivityIndicator,Image} from 'react-native'
import {check,request,PERMISSIONS,RESULTS} from 'react-native-permissions'
import { HeaderBack, HeaderTitle } from '../../../../../../components'
import { COLOR, FONT_REGULAR, SIZES, INPUT_HEIGHT } from '../../../../../../res/constants'
import ContactInfoRender from './ContactInfoRender'
import {useSelector} from 'react-redux'
import Contacts from 'react-native-contacts'
import {sortBy} from 'lodash'

const WalletContacts = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Your Contacts']} />,
    })

    const session = useSelector(state=>state.session)

    const [data, setData] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    const [filteredData, setFilteredData] = useState(null);
    const [searchString,setSearchString] = useState("");

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


    const filterSearch = (value)=> {
        setSearchString(value)
        const filteredContacts = data.filter((contact) => {
          return contact.name.toLowerCase().includes(value.toLowerCase()) || contact.number.toLowerCase().includes(value.toLowerCase())
        });
        setFilteredData(filteredContacts);
    }

    const setRecipient = (recipient) => {
      route.params.setRecipientInfo(recipient)
      return navigation.navigate("ToktokWalletSendMoney")
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
      <View style={styles.container}>
        <View style={styles.searchField}>
            <View style={[styles.input,{flexDirection: "row"}]}>
                {/* <Image style={{height: 25,width: 40,alignSelf: "center"}} resizeMode="center" source={require('../../../../../../assets/icons/ph.png')}/> */}
                <TextInput 
                    style={{fontSize: SIZES.M,fontFamily: FONT_REGULAR,padding: 0,marginLeft: 5,alignSelf: "center",flex: 1}}
                    placeholder="Enter a Name or mobile number"
                    onChangeText={filterSearch}
                    value={searchString}
                />
            </View>
        </View>

          <View style={styles.contactlist}>
                   <FlatList
                          showsVerticalScrollIndicator={false}
                          data={filteredData}
                          keyExtractor={(item)=>item.number}
                          style={{flex: 1}}
                          renderItem={({item,index})=>{
                            return <ContactInfoRender item={item} index={index} setSearchString={setSearchString} checkAccount={setRecipient}/>
                          }}
                      />
          </View>
      </View>
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
      paddingHorizontal: 5,
      height: INPUT_HEIGHT,
      fontSize: SIZES.M,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "silver",
      fontFamily: FONT_REGULAR
    },
})

export default WalletContacts