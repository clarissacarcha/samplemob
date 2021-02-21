import React , {useEffect,useState , useCallback} from 'react'
import {View,StyleSheet,Dimensions,Image,Text,TouchableOpacity,ActivityIndicator,TouchableHighlight,FlatList} from 'react-native'
import {useNavigation,useFocusEffect,useRoute} from '@react-navigation/native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../components'
import {useSelector,useDispatch} from 'react-redux'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM} from '../../../../res/constants'
import {CardShadow, CardHeader, CardBody, CardRow, Hairline, SizedBox} from '../../../../components/widgets';
import FA5Icon from 'react-native-vector-icons/FontAwesome5'
import {useQuery,useLazyQuery,useMutation} from '@apollo/react-hooks'
import {GET_TOKTOK_WALLET, POST_TOKTOK_WALLET} from '../../../../graphql'
import {MoneyCommaFormat} from '../../../../util/HelperUtility'
import {numberFormat} from '../../../../helper'
import {onError} from '../../../../util/ErrorUtility'
import EIcon from 'react-native-vector-icons/Entypo';

const {height,width} = Dimensions.get('window')

const WalletComponent = ()=> {
   const navigation = useNavigation()
   const session = useSelector(state=> state.session)
   const [mounted, setMounted] = useState(true)

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        // headerTitle: () => <HeaderTitle label={['My', 'Wallet']} />,
        title: ""
    }); 


    const [getToktokWallet, {data = {getToktokWallet: {record: {}}}, loading , error}] = useLazyQuery(GET_TOKTOK_WALLET, {
        fetchPolicy: 'network-only',
        variables: {
            input: {
                userId: session.user.id,
            },
        },
        onCompleted: ({getToktokWallet}) => {
           
        },
    });

    const [postToktokWallet, {loading: postLoading}] = useMutation(POST_TOKTOK_WALLET, {
        fetchPolicy: 'no-cache',
        onError: onError,
        variables: {
          input: {
            userId: session.user.id,
          },
        },
        onCompleted: (result) => {
          getToktokWallet();
        },
      });

      
     
    // useFocusEffect(useCallback(()=>{
    //     setMounted(true)
    //     getToktokWallet()
    //     return ()=> {
    //         setMounted(false)
    //     }
    //  },[]))

    useEffect(()=>{
        setMounted(true)
        getToktokWallet()
        return ()=> {
            setMounted(false)
        }
    },[])

     const onPost = () => {
        postToktokWallet();
      };

    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }

    if (!data.getToktokWallet.record) {
        return (
          <>
            <AlertOverlay visible={postLoading} />
            <View style={{height: 20}} />
            <TouchableHighlight onPress={onPost} underlayColor={COLOR} style={[styles.submitBox, {margin: 20}]}>
              <View style={styles.submit}>
                <Text style={{color: COLOR, fontSize: 20}}>Create My Toktok Wallet</Text>
              </View>
            </TouchableHighlight>
          </>
        );
      }

    
    const WalletOptionsBtn = ({route,icon,name})=> (
            <TouchableOpacity style={{
            
                backgroundColor: "black",  
                height: 30, 
                justifyContent: "center",
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginRight: 10,
                borderRadius: 5,
            }}
                onPress={()=> navigation.navigate(route, {walletId: data.getToktokWallet.record.id})}
            >
                <Text style={{color: COLOR}}><FA5Icon name={icon} />  {name}</Text>
            </TouchableOpacity>
     )
    

    const WalletInfo = ()=> (
        <CardShadow> 
            <CardBody>       
            <View style={styles.wallet}>
                <View style={styles.walletinfo}>
                    <View style={styles.walletimage}>
                        <Image style={{position: "absolute" , height: 75, width: 50,}} resizeMode={'contain'} source={require('../../../../assets/images/ToktokMotorcycle.png')} />
                    </View>
                    <View style={styles.walletdescription}>
                        <Text style={{fontWeight:"bold", fontSize: 30, color: COLOR , fontFamily: FONT_FAMILY, marginBottom: 7,}}>TokTok Wallet</Text>
                        <Text style={{color: FONT_COLOR, fontSize: 24, fontFamily: FONT_FAMILY,marginLeft: 3,}}>P {MoneyCommaFormat(data.getToktokWallet.record.balance,2)}</Text>
                    </View>
                </View>

                <View style={styles.walletoptions}>
                        <WalletOptionsBtn name="Cash In" icon="wallet" route="TokTokWalletCashInPaypanda"/>
                </View>
            </View>
            </CardBody>
    </CardShadow>
    )


    const RenderTransactionLog = ({item,index})=> {

        lastItem = data.getToktokWallet.record.latestTransactions.length === index + 1 ? true : false
        return (
        <View
            style={[styles.transactionLogContainer , {marginBottom: lastItem ? 20 : 0}]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <EIcon
                name={item.incoming != 0 ? 'arrow-bold-down' : 'arrow-bold-up'}
                style={styles.iconBox}
                size={18}
                color="white"
                />
                 <View style={{flex: 1}}>
                    <Text style={{color: DARK, fontSize: 12, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>{item.type}</Text>
                    <Text style={{color: MEDIUM, fontSize: 10, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
                    {item.createdAt}
                    </Text>
                    {item.delivery && (
                    <Text style={{color: MEDIUM, fontSize: 10, fontFamily: 'Rubik-Medium', marginHorizontal: 10}}>
                        Delivery ID: {item.delivery.deliveryId}
                    </Text>
                    )}
                </View>
                {!(item.incoming == 0 && item.outgoing == 0) && (
                    <EIcon name={item.incoming != 0 ? 'plus' : 'minus'} size={14} color={item.incoming != 0 ? 'green' : 'red'} />
                )}

                {!(item.incoming == 0 && item.outgoing == 0) ? (
                    <Text style={{color: item.incoming != 0 ? 'green' : 'red', fontSize: 14, fontFamily: 'Rubik-Medium'}}>
                    {item.incoming != 0 ? numberFormat(item.incoming) : numberFormat(item.outgoing)}
                    </Text>
                ) : (
                    <Text style={{color: MEDIUM, fontSize: 14, fontFamily: 'Rubik-Medium'}}>0.00</Text>
                 )}
            </View>
        </View>
        )
    }

    return <>
    {
        mounted && 
        <View style={styles.container}>

            <WalletInfo />

            <View style={styles.history}>
                <View style={styles.historyHeader}>
                    <Text style={{flex: 1,marginLeft: 10,fontFamily: FONT_FAMILY , justifyContent: 'flex-start'}}>Transactions</Text>
                    <TouchableHighlight
                        onPress={()=>navigation.navigate("TokTokWalletTransactionLogs",{toktokWalletId: data.getToktokWallet.record.id})}
                    >
                        <Text style={{marginRight: 10,fontFamily: FONT_FAMILY, color: "#4867AA" , alignItems: 'flex-end'}}>Show All</Text>
                    </TouchableHighlight>
                </View>
                {/* <Text>{JSON.stringify(data.getToktokWallet.record)}</Text> */}
                <FlatList
                     data={data.getToktokWallet.record.latestTransactions}
                     renderItem={RenderTransactionLog}
                     keyExtractor={(item)=>item.id}
                     extraData={data.getToktokWallet.record.latestTransactions}
                     style={styles.historyContents} 
                />
            </View>

        </View>
    }
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    wallet: {
        height: 160,
    },
    walletinfo: {
        flex: 1,
        flexDirection: "row",
        // backgroundColor: "red",
    },
    walletimage: {
        width: 70,
        position: "relative",
        justifyContent: "center",
        alignItems: "center"
    },
    walletdescription: {
        justifyContent: "center",
        marginLeft: 5
    },
    walletoptions: {
        flex: 0.5   ,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    history: {
        flex: 1,
        marginTop: 10,
       
    },
    historyHeader: {
        height: 40,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row"
    },
    historyContents: {
        flex: 1,
    },
    submitBox: {
        // flex: 1,
        height: 50,
        borderRadius: 10,
        marginTop: 0,
      },
    submit: {
        flex: 1,
        backgroundColor: DARK,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionLogContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        marginVertical: 20,
        borderRadius: 10,
        shadowColor: '#000',
  
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center',
        height: 60,
    },
    iconBox: {
        backgroundColor: COLOR,
        height: 24,
        width: 24,
        borderRadius: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
})

export default WalletComponent