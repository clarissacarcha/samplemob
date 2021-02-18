import React , {useEffect,useState , useCallback} from 'react'
import {View,StyleSheet,Dimensions,Image,Text,TouchableOpacity,ActivityIndicator,TouchableHighlight} from 'react-native'
import {useNavigation,useFocusEffect,useRoute} from '@react-navigation/native'
import {HeaderBack, HeaderTitle, SomethingWentWrong , AlertOverlay} from '../../../../components'
import {useSelector,useDispatch} from 'react-redux'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR} from '../../../../res/constants'
import {CardShadow, CardHeader, CardBody, CardRow, Hairline, SizedBox} from '../../../../components/widgets';
import FA5Icon from 'react-native-vector-icons/FontAwesome5'
import {useQuery,useLazyQuery,useMutation} from '@apollo/react-hooks'
import {GET_TOKTOK_WALLET, POST_TOKTOK_WALLET} from '../../../../graphql'
import {MoneyCommaFormat} from '../../../../util/HelperUtility'
import {onError} from '../../../../util/ErrorUtility'

const {height,width} = Dimensions.get('window')

const WalletComponent = ()=> {
   const navigation = useNavigation()
   const session = useSelector(state=> state.session)

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
    //     getToktokWallet()
    //  },[]))

    useEffect(()=>{
        getToktokWallet()
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
                        <Text style={{color: FONT_COLOR, fontSize: 24, fontFamily: FONT_FAMILY,marginLeft: 3,}}>P {data.getToktokWallet.record.balance && MoneyCommaFormat(data.getToktokWallet.record.balance,2)}</Text>
                    </View>
                </View>

                <View style={styles.walletoptions}>
                        <WalletOptionsBtn name="Cash In" icon="wallet" route="TokTokWalletCashInPaypanda"/>
                </View>
            </View>
            </CardBody>
    </CardShadow>
    )

    return <>
        <View style={styles.container}>

            <WalletInfo />

            <View style={styles.history}>
                <View style={styles.historyHeader}>
                    
                </View>

                <View style={styles.historyContents}>

                </View>
            </View>

        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    wallet: {
        height: 180,
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
        flex: 0.6   ,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    history: {
        flex: 1,
        marginTop: 10,
       
    },
    historyHeader: {
        height: 50,
        // backgroundColor: "gray",
        borderRadius: 10,
    },
    historyContent: {
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
})

export default WalletComponent