import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ActivityIndicator} from "react-native";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

export const SwipeReloader = ({state, onSwipeUp, }) => {

	const [loading, setLoading] = useState(state)

	useEffect(() => {
		setLoading(state)
	}, [state])

	return (
		<>
			<View style={{paddingTop: 15}} />
      {loading && <ActivityIndicator animating={loading} color="#F6841F" size={28} />}
      {!loading && 
				<GestureRecognizer
          config={{
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          }}
          onSwipeUp={onSwipeUp}
        >
          <View style={{width: '100%', height: 35, backgroundColor: 'white'}} />
        </GestureRecognizer>
			}
		</>
	)
}