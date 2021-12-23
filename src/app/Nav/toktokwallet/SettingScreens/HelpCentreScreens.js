import React from 'react'
import {
    ToktokWalletHelpCentreContactUs,
    ToktokWalletHelpCentreLayeredSecurity,
    ToktokWalletHelpCentreMoneyProtected,
    ToktokWalletHelpCentreSecurityPrivacy,
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletHelpCentreContactUs" component={ToktokWalletHelpCentreContactUs}/>
    <Navigator.Screen name="ToktokWalletHelpCentreLayeredSecurity" component={ToktokWalletHelpCentreLayeredSecurity}/>
    <Navigator.Screen name="ToktokWalletHelpCentreMoneyProtected" component={ToktokWalletHelpCentreMoneyProtected}/>
    <Navigator.Screen name="ToktokWalletHelpCentreSecurityPrivacy" component={ToktokWalletHelpCentreSecurityPrivacy}/>
    </>
);