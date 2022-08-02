import React from 'react'
import { 
	StyleSheet, 
	View
} from 'react-native'
import WebView from 'react-native-webview'

export const ToktokMallPaymentWebview = ({navigation, route}) => {
	return (
		<>
			<View style={styles.container} />
			<WebView
				style={styles.webView}
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

const styles = StyleSheet.create({
	container: {
		height: 60, 
		backgroundColor: '#fff'
	},
	webView: {
		width: '100%'
	}
})

