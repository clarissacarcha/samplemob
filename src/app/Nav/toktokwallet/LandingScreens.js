import React from 'react'

import {
    ToktokWalletHomePage,
    ToktokWalletLinkAccount,
    ToktokWalletRestricted,
    ToktokWalletReviewAndConfirm,
    ToktokWalletTransactions,
} from 'toktokwallet/screens'

export default ({Navigator}) => (
    <>
    <Navigator.Screen name="ToktokWalletHomePage" component={ToktokWalletHomePage}/>
    <Navigator.Screen name="ToktokWalletLinkAccount" component={ToktokWalletLinkAccount}/>
    <Navigator.Screen name="ToktokWalletRestricted" component={ToktokWalletRestricted}/>
    <Navigator.Screen name="ToktokWalletReviewAndConfirm" component={ToktokWalletReviewAndConfirm}/>
    <Navigator.Screen name="ToktokWalletTransactions" component={ToktokWalletTransactions}/>
    </>
);