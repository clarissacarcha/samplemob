import React, {useState, useEffect} from 'react'
import {View, Text} from 'react-native'
import axios from 'axios'
import WebView from 'react-native-webview'

export const ToktokMallPaymentWebview = ({navigation, route}) => {

	useEffect(() => {
		// console.log(route.params)
	}, [])

	return (
		<>
			<View style={{height: 60, backgroundColor: '#fff'}} />
			<WebView
				style={{width: '100%'}}
        originWhitelist={['*']}
				scalesPageToFit={true}
				javaScriptEnabled={true}
  			domStorageEnabled={true}
  			startInLoadingState={true}
  			ignoreSslError={true}
				allowUniversalAccessFromFileURLs={true}
        source={{ html: route?.params?.contents + "" }}
      />
		</>
	)

}