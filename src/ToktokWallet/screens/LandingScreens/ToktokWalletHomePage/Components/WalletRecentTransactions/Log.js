import React , {useState} from 'react'
import { View , Text , StyleSheet , TouchableOpacity , Image } from 'react-native'
import { numberFormat , MaskLeftZero } from 'toktokwallet/helper';
import { useAccount } from 'toktokwallet/hooks';
import { useThrottle } from 'src/hooks'
import moment from 'moment'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import Details from './Details';

const { COLOR, FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS


const Log = ({
    transaction,
    itemsLength,
    index
})=> {

    const { tokwaAccount } = useAccount();
    const {
        id,
        refNo,
        name,
        phrase,
        details,
        amount,
        sourceWalletId,
        createdAt
    } = transaction

    const [openModal,setOpenModal] = useState(false);
    const [transactionInfo,setTransactionInfo] = useState({})
    const amountcolor = sourceWalletId == tokwaAccount.wallet.id ? COLOR.RED : "green"
    const amountprefix = sourceWalletId == tokwaAccount.wallet.id ? "-" : "+"
    const transactionAmount = `${tokwaAccount.wallet.currency.code} ${numberFormat(amount)}`
    const referenceDate = moment(createdAt).tz('Asia/Manila').format('MMM DD YYYY h:mm a')

    const showDetails = ()=> {
        setTransactionInfo({
            name,
            phrase,
            details,
            amount: transactionAmount,
            refNo,
            refDate: referenceDate,
        })
        setOpenModal(true)
    }

    const OnThrottledPress = useThrottle( showDetails , 2000 )

    return (
        <>
            <Details
                visible={openModal}
                setVisible={setOpenModal}
                transaction={transactionInfo}
            />
            <TouchableOpacity
                style={styles.transaction}
                onPress={OnThrottledPress}
            >
                <View style={styles.transactionDetails}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{name}</Text>
                    <Text style={{color: "#929191",fontSize: FONT_SIZE.S,fontFamily: FONT.REGULAR}}>{phrase}</Text>
                </View>
                <View style={styles.transactionAmount}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR , color: amountcolor}}>{transactionAmount}</Text>
                    <Text style={{color: "#929191",fontSize: FONT_SIZE.S,fontFamily: FONT.REGULAR, alignSelf: "flex-end"}}>{referenceDate}</Text>
                </View>

            </TouchableOpacity>
            <View style={styles.divider}/>
        </>
    )

}

const styles = StyleSheet.create({
    transactionLogsContainer: {
        marginVertical: 10
    },
    transaction: {
        paddingVertical: 12,
        // marginVertical: 5,
        flexDirection: "row",
    },
    transactionIcon: {
        flexBasis: 50,
        alignSelf: "center"
    },
    transactionDetails: {
        flex: 1,
    },
    transactionAmount: {
        flexBasis: "auto",
        alignItems: "flex-end"
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})

export default Log
