import React from 'react'
import {
    // Help Centre Screens
    ToktokWalletHelpCentreLayeredSecurity,
    ToktokWalletHelpCentreMoneyProtected,
    ToktokWalletHelpCentreSecurityPrivacy,

    // Pin Code Screens
    ToktokWalletCreatePin,
    ToktokWalletRecoverPin,
    ToktokWalletRecoveryMethods,
    ToktokWalletUpdatePin,

    // Others
    ToktokWalletCashInLogs,
    ToktokWalletCashOutLogs,
    ToktokWalletPaymentChart,
    ToktokWalletSettings,
    ToktokWalletTermsConditions,
    ToktokWalletTransactionLimit
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    {/* Help Centre Screens */}
    <Navigator.Screen name="ToktokWalletHelpCentreLayeredSecurity" component={ToktokWalletHelpCentreLayeredSecurity}/>
    <Navigator.Screen name="ToktokWalletHelpCentreMoneyProtected" component={ToktokWalletHelpCentreMoneyProtected}/>
    <Navigator.Screen name="ToktokWalletHelpCentreSecurityPrivacy" component={ToktokWalletHelpCentreSecurityPrivacy}/>
    
    {/* Pin Code Screens */}
    <Navigator.Screen name="ToktokWalletCreatePin" component={ToktokWalletCreatePin}/>
    <Navigator.Screen name="ToktokWalletRecoverPin" component={ToktokWalletRecoverPin}/>
    <Navigator.Screen name="ToktokWalletRecoveryMethods" component={ToktokWalletRecoveryMethods}/>
    <Navigator.Screen name="ToktokWalletUpdatePin" component={ToktokWalletUpdatePin}/>

    {/* Others */}
    <Navigator.Screen name="ToktokWalletCashInLogs" component={ToktokWalletCashInLogs}/>
    <Navigator.Screen name="ToktokWalletCashOutLogs" component={ToktokWalletCashOutLogs}/>
    <Navigator.Screen name="ToktokWalletPaymentChart" component={ToktokWalletPaymentChart}/>
    <Navigator.Screen name="ToktokWalletSettings" component={ToktokWalletSettings}/>
    <Navigator.Screen name="ToktokWalletTermsConditions" component={ToktokWalletTermsConditions}/>
    <Navigator.Screen name="ToktokWalletTransactionLimit" component={ToktokWalletTransactionLimit}/>
    </>
);