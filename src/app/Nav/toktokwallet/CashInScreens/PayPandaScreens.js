
import React from 'react'
import {
    ToktokWalletPayPandaForm,
    ToktokWalletPayPandaWebView,
} from 'toktokwallet/screens'

export default ({Navigator})=> (
    <>
    <Navigator.Screen name="ToktokWalletPayPandaForm" component={ToktokWalletPayPandaForm}/>
    <Navigator.Screen name="ToktokWalletPayPandaWebView" component={ToktokWalletPayPandaWebView}/>
    </>
)