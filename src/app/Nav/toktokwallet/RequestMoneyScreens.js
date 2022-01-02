import React from 'react'
import { View, Text , StyleSheet} from 'react-native'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Separator,CheckIdleState} from 'toktokwallet/components';
import { HeaderBack , HeaderTitle} from 'src/revamp';
import {
    ToktokWalletRequestMoney,
    ToktokWalletRequestMoneyPending,
    ToktokWalletRequestMoneySent,
    ToktokWalletRequestMoneyViewDetails
} from 'toktokwallet/screens'
import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN } = CONSTANTS

const PendingRequestMoney = createMaterialTopTabNavigator();

const RenderPendingRequest = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
    })

    return (
        <>
        <PendingRequestMoney.Navigator
            swipeEnabled={false}
            upperCaseLabel={false}
            initialRouteName="ToktokWalletRequestMoneyPending"
            tabBarOptions = {{
                activeTintColor: 'white',
                inactiveTintColor: 'black',
                // indicatorStyle: { backgroundColor: 'red', height: '100%' },
                indicatorStyle: { backgroundColor: COLOR.YELLOW },
                pressOpacity: 1,
            }}
        >
            <PendingRequestMoney.Screen 
                name="ToktokWalletRequestMoneyPending" 
                component={ToktokWalletRequestMoneyPending}
                options={() => ({
                    tabBarLabel: ({focused}) => {
                     return <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Request Received</Text>
                    },
                  })}
            />
             <PendingRequestMoney.Screen 
                name="ToktokWalletRequestMoneySent" 
                component={ToktokWalletRequestMoneySent}
                options={() => ({
                    tabBarLabel: ({focused}) => {
                     return <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Request Sent</Text>
                    },
                  })}
            />
        </PendingRequestMoney.Navigator>
        </>
    )
}

export default ({Navigator}) => (
    <>
        <Navigator.Screen name="ToktokWalletRequestMoney" component={ToktokWalletRequestMoney}/>
        <Navigator.Screen name="ToktokWalletRequestMoneyPending" component={RenderPendingRequest}/>
        <Navigator.Screen name="ToktokWalletRequestMoneyViewDetails" component={ToktokWalletRequestMoneyViewDetails}/>
    </>
);