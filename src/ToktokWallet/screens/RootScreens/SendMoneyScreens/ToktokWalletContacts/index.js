import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Platform,FlatList,ActivityIndicator,Image} from 'react-native'
import {check,request,PERMISSIONS,RESULTS} from 'react-native-permissions'
import { CheckIdleState, FlagSecureScreen } from 'toktokwallet/components'
import {useSelector} from 'react-redux'
import Contacts from 'react-native-contacts'
import {sortBy} from 'lodash'
import {Separator} from 'toktokwallet/components'
import { HeaderBack , HeaderTitle , ICON_SET, VectorIcon } from 'src/revamp'
import { useContacts } from 'toktokwallet/hooks';
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE , MARGIN } = CONSTANTS

//SELF IMPORTS 
import ContactInfoRender from './ContactInfoRender'

export const ToktokWalletContacts = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['All Contacts']} />,
    })

    const session = useSelector(state=>state.session)
    const { contacts } = useContacts();

    const [data, setData] = useState([]);
    const [fetchError, setFetchError] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [searchString,setSearchString] = useState("");


    const filterSearch = (value)=> {
        setSearchString(value)
        const filteredContacts = data.filter((contact) => {
          return contact.name.toLowerCase().includes(value.toLowerCase())
        });
        console.log(JSON.stringify(filteredContacts))
        setFilteredData(filteredContacts);
    }

    const setRecipient = (recipient) => {
      route.params.setRecipientInfo(recipient)
      return navigation.navigate("ToktokWalletSendMoney")
    }


    useEffect(()=>{
      if(contacts){
        setData(contacts);
        setFilteredData(contacts);
      }
    },[contacts])

    
    if (!filteredData) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size={24} color={COLOR.YELLOW} />
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
      <FlagSecureScreen>
      <CheckIdleState>
      <Separator />
      <View style={styles.container}>
        <View style={styles.searchField}>
            <View style={[styles.input,{flexDirection: "row"}]}>
               <View style={{justifyContent:"center"}}> 
                <VectorIcon size={28} iconSet={ICON_SET.Feather} name="search"/>
               </View>
                <TextInput 
                    style={{color: COLOR.DARK,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,padding: 0,marginLeft: 5,alignSelf: "center",flex: 1}}
                    placeholder="Enter a name or mobile number"
                    placeholderTextColor={COLOR.DARK}
                    onChangeText={filterSearch}
                    value={searchString}
                />
            </View>
        </View>

          <View style={styles.contactlist}>
                   <FlatList
                          showsVerticalScrollIndicator={false}
                          data={searchString ? filteredData : data}
                          keyExtractor={(item,index)=>index}
                          style={{flex: 1}}
                          contentContainerStyle={{ flexGrow: 1 }}
                          renderItem={({item,index})=>{
                            return <ContactInfoRender item={item} index={index} setSearchString={setSearchString} checkAccount={setRecipient}/>
                          }}
                      />
          </View>
      </View>
      </CheckIdleState>
      </FlagSecureScreen>
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
        paddingHorizontal: 10,
        paddingTop: 15,
        backgroundColor:"white",
    },
    contactlist: {
        flex: 1,
        padding: MARGIN.M,
    },
    input: {
      paddingHorizontal: 5,
      height: SIZE.FORM_HEIGHT,
      fontSize: FONT_SIZE.M,
      borderRadius: 5,
      backgroundColor:"#F7F7FA",
      fontFamily: FONT.REGULAR
    },
})

